const db = require("../db");
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const uuid = require("uuid");
class UserService {
  async registration(name, surname, email, password) {
    const activationLink = uuid.v4();
    const person = await db.query("SELECT * FROM person where email=$1 AND password=$2", [email, password]);
    if (person.rows[0]) {
      return "Пользователь существует";
    }
    const newPerson = await db.query(
      "INSERT INTO person(name, surname, email, password, activationLink) values ($1, $2, $3, $4, $5) RETURNING *",
      [name, surname, email, password, activationLink]
    );

    const { accessToken, refreshToken } = tokenService.generationToken(newPerson.rows[0]);
    const id = await newPerson.rows[0].id;
    const newToken = await db.query(
      "INSERT INTO token (accessToken, refreshToken, user_id) values ($1, $2, $3) RETURNING *",
      [accessToken, refreshToken, id]
    );
    await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
    const userData = [newPerson.rows[0], newToken.rows[0]];
    return userData;
  }

  async login(email, password) {
    try {
      const user = await db.query("SELECT * FROM person where email=$1 AND password=$2", [email, password]);
      if (!user.rows[0]) {
        return "Пользователь не существует";
      }
      const id = await user.rows[0].id;
      const { accessToken, refreshToken } = tokenService.generationToken(user.rows[0]);
      const token = await db.query(
        "UPDATE token set accessToken = $1, refreshToken = $2 where user_id = $3 RETURNING *",
        [accessToken, refreshToken, id]
      );
      const userData = [user.rows[0], token.rows];

      return userData;
    } catch (e) {
      console.log(e);
    }
  }

  async activate(activationLink) {
    const user = await db.query("UPDATE person set isActivated=$1 where activationLink = $2 RETURNING *", [
      true,
      activationLink,
    ]);
    return user.rows[0];
  }
}

module.exports = new UserService();

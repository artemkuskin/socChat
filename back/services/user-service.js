const db = require("../db");
const tokenService = require("./token-service");
class UserService {
  async registration(name, surname, email, password) {
    const newPerson = await db.query(
      "INSERT INTO person(name, surname, email, password) values ($1, $2, $3, $4) RETURNING *",
      [name, surname, email, password]
    );

    const { accessToken, refreshToken } = tokenService.generationToken(newPerson.rows[0]);
    const id = await newPerson.rows[0].id;
    const newToken = await db.query(
      "INSERT INTO token (accessToken, refreshToken, user_id) values ($1, $2, $3) RETURNING *",
      [accessToken, refreshToken, id]
    );
    const userData = [newPerson.rows[0], newToken.rows[0]];
    return userData;
  }
}

module.exports = new UserService();

const db = require("../db");
const tokenService = require("../services/token-service");
const userService = require("../services/user-service");
class UserController {
  async registration(req, res) {
    try {
      const { name, surname, email, password } = req.body;
      const userData = await userService.registration(name, surname, email, password);
      const refreshToken = userData[1].refreshtoken;
      res.cookie("refreshToken", refreshToken, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.json(userData);
    } catch (e) {
      console.log(e);
    }
  }

  async getUsers(req, res) {
    try {
      const users = await db.query("SELECT * FROM person");
      res.json(users.rows);
    } catch (e) {
      console.log(e);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.json(userData);
    } catch (e) {
      console.log(e);
    }
  }

  async activate(req, res) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      console.log(e);
    }
  }

  async deleteUser(req, res) {
    try {
      const id = req.params.id;
      const user = await db.query("DELETE FROM person where id = $1", [id]);
      if (!user.rows[0]) {
        res.json("Пользователя с таким id не существует");
      } else {
        res.json(user.rows[0]);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async updateUser(req, res) {
    try {
      const { id, name, surname, email, password } = req.body;
      const user = await db.query("UPDATE person set name=$1, surname=$2, email=$3, password=$4 where id = $5", [
        name,
        surname,
        email,
        password,
        id,
      ]);
      res.json(user.rows[0]);
    } catch (e) {
      console.log(e);
    }
  }
}
module.exports = new UserController();

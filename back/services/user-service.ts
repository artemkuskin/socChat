import { db } from "../db";
import { v4 as uuidv4 } from "uuid";
import { MailService } from "./mail-service";
import { TokenService } from "./token-service";
import { ApiError } from "../exaption/api-error";

const mailService = new MailService();
const tokenService = new TokenService();

export class UserService {
  async registration(name: any, surname: any, email: any, password: any) {
    const activationLink = uuidv4();
    const person = await db.query("SELECT * FROM person where email=$1 AND password=$2", [email, password]);
    if (person.rows[0]) {
      throw ApiError.BadRequest(`Пользователь с почтовым адрессом ${person.rows[0].email} существует`);
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

  async login(email: any, password: any) {
    const user = await db.query("SELECT * FROM person where email=$1 AND password=$2", [email, password]);
    if (!user.rows[0]) {
      console.log(email, password);

      throw ApiError.BadRequest("Неверный логин или пароль");
    }

    const id = await user.rows[0].id;
    const { accessToken, refreshToken } = tokenService.generationToken(user.rows[0]);
    const token = await db.query("DELETE FROM token where user_id = $1", [id]);
    const newToken = await db.query(
      "INSERT INTO token (accessToken, refreshToken, user_id) values ($1, $2, $3) RETURNING *",
      [accessToken, refreshToken, id]
    );
    const userData = [user.rows[0], newToken.rows[0], token.rows[0]];

    return userData;
  }

  async activate(activationLink: any) {
    const user = await db.query("UPDATE person set isActivated=$1 where activationLink = $2 RETURNING *", [
      true,
      activationLink,
    ]);
    return user.rows[0];
  }

  async logout(refreshToken: any) {
    const token = await db.query("DELETE FROM token where refreshToken = $1", [refreshToken]);
    return token;
  }

  async getAllUsers() {
    const users = await db.query("SELECT * FROM person");
    return users;
  }

  async checkAuth(req: any, res: any, next: any) {
    try {
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        return next(ApiError.UnautorizedError());
      }

      const accessToken = authorizationHeader.split(" ")[1];
      if (!accessToken) {
        return next(ApiError.UnautorizedError());
      }

      const userData = tokenService.validateAccessToken(accessToken);
      if (!userData) {
        return next(ApiError.UnautorizedError());
      }

      req.user = userData;
      next();
    } catch (e) {
      return next(ApiError.UnautorizedError());
    }
  }

  async refresh(token: any) {
    if (!token) {
      throw ApiError.UnautorizedError();
    }
    const userData = tokenService.validateRefreshToken(token);
    const tokenFromDb = await tokenService.findToken(token);
    if (!userData) {
      throw ApiError.UnautorizedError();
    }

    const user = await db.query("SELECT * FROM person where id=$1", [tokenFromDb.user_id]);

    const id = await user.rows[0].id;
    const { accessToken, refreshToken } = tokenService.generationToken(user.rows[0]);
    const newToken = await db.query(
      "UPDATE token set accessToken = $1, refreshToken = $2 where user_id = $3 RETURNING *",
      [accessToken, refreshToken, id]
    );

    const newUserData = [user.rows[0], newToken.rows[0]];

    return newUserData;
  }
}

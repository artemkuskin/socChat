import { UserService } from "../services/user-service";
const userService = new UserService();
export class UserController {
  async registration(req: any, res: any) {
    try {
      const { name, surname, email, password } = req.body;
      const userData = await userService.registration(name, surname, email, password);
      const refreshToken = userData[1].refreshtoken;
      res.cookie("refreshToken", refreshToken, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      console.log(e);
    }
  }

  async login(req: any, res: any) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      const refreshToken = userData[1].refreshtoken;
      res.cookie("refreshToken", refreshToken, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      console.log(e);
    }
  }

  async activate(req: any, res: any) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      console.log(e);
    }
  }

  async logout(req: any, res: any) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(token.rows[0]);
    } catch (e) {
      console.log(e);
    }
  }

  async getUsers(req: any, res: any) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users.rows);
    } catch (e) {
      console.log(e);
    }
  }

  async checkAuth(req: any, res: any, next: any) {
    const userData = await userService.checkAuth(req, res, next);
    return userData;
  }

  async refresh(req: any, res: any) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      const newRefreshToken = userData[1].refreshtoken;
      res.cookie("refreshToken", newRefreshToken, {
        maxAge: 15 * 24 * 60 * 60 * 10000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      console.log(e);
    }
  }
}

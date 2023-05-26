import jwt from "jsonwebtoken";
import { db } from "../db";
export class TokenService {
  generationToken(payload: any) {
    const secretAccess = process.env.JWT_ACCESS_TOKEN || "defaultSecretAccess";
    const secretRefresh = process.env.JWT_REFRESH_TOKEN || "defaultSecretRefresh";
    const accessToken = jwt.sign(payload, secretAccess, {
      expiresIn: "15s",
    });
    const refreshToken = jwt.sign(payload, secretRefresh, {
      expiresIn: "30d",
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  validateAccessToken(token: any) {
    try {
      const secretAccess = process.env.JWT_ACCESS_TOKEN || "defaultSecretAccess";
      const userData = jwt.verify(token, secretAccess);
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token: any) {
    try {
      const secretRefresh = process.env.JWT_REFRESH_TOKEN || "defaultSecretRefresh";
      const userData = jwt.verify(token, secretRefresh);
      return userData;
    } catch (e) {
      return null;
    }
  }

  async findToken(refreshToken: string) {
    const tokenData = await db.query("SELECT * FROM token where refreshtoken = $1", [refreshToken]);
    return tokenData.rows[0];
  }
}

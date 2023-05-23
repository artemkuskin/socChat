const jwt = require("jsonwebtoken");
class TokenService {
  generationToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {
      expiresIn: "30m",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, {
      expiresIn: "30d",
    });
    return {
      accessToken,
      refreshToken,
    };
  }
}

module.exports = new TokenService();

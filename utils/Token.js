const { sign } = require("jsonwebtoken");

class Token {
  // ? ************************************ Create Token ******************************** */
  static createToken(data) {
    return sign({ data }, process.env.NODE_APP_JWT_SECRET_KEY, {
      // expiresIn: "24h",
    });
  }

  // ? ************************************ Get Token ******************************** */
  static getToken(req) {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader === undefined || bearerHeader === "") {
      throw new Error("unauthenticated. Try to login again!");
    }
    const token = bearerHeader.split(" ")[1];

    return token;
  }
}

module.exports = Token;

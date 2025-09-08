const { verify } = require("jsonwebtoken");
const { failed } = require("../../utils/reply");

// ? ******************************* Verify the token ******************************* */
exports.verifyToken = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader === undefined || bearerHeader === "") {
      throw new Error("unauthenticated. Try to login again!");
    }
    const token = bearerHeader.split(" ")[1];
    const decoded = verify(token, process.env.NODE_APP_JWT_SECRET_KEY);
    if (!decoded) {
      throw new Error("unauthenticated. Try to login again!");
    }
    req.user = decoded.data;
    // const result = await UseApis.get("auth", "is-active-token", req);
    // if (!result.status) {
    //   throw new Error(result.message);
    // }

    // if (!result.data.token) {
    //   throw new Error(result.message);
    // }
    next();
  } catch (error) {
    return failed(res, error.message);
  }
};

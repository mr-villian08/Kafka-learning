const { failed } = require("../../utils/reply");

const ApiCheck = (req, res, next) => {
  try {
    const baseUrl = req.baseUrl
      .replace("/api/v1/", "")
      .replace("/v1", "")
      .replaceAll("-", "_");

    const keyName = process.env[`NODE_APP_${baseUrl.toUpperCase()}_API_KEY`];

    if (!keyName) {
      throw new Error("API key is missing. Please add one.");
    }

    if (req.header("x-api-key") === keyName) {
      return next();
    }

    throw new Error("Invalid API key. Try again!");
  } catch (error) {
    return failed(res, error.message, 401);
  }
};

module.exports = ApiCheck;

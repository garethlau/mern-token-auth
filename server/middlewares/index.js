const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

module.exports = {
  auth: async (req, res, next) => {
    const authorization = req.headers["authorization"];
    if (!authorization) {
      return res.status(401).send();
    }

    try {
      const token = authorization.split(" ")[1];
      const payload = jwt.verify(token, keys.ACCESS_TOKEN_SECRET);
      req.payload = payload;
      next();
    } catch (err) {
      console.log(err.message);
      return res.status(401).send();
    }
  },
};

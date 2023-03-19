const jwt = require("jsonwebtoken");
const users = require("../models/userModels");

const protect = async (req, res, next) => {
  // vrify authentication
  const { authorization } = req.headers;
  if (!authorization) {
    return res.json({ error: "auth required" });
  }

  const token = authorization.split(" ")[1];
  try {
    const { _id } = jwt.verify(token, process.env.SECRET_TOKEN);

    req.user = await users.findOne({ _id }).select("_id");
    next();
  } catch (error) {
    console.log(error);
    res.send({ message: "request not authorized" });
  }
};

module.exports = protect;

const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const BlacklistToken = require("../models/blacklistToken.model");

module.exports.authUser = async function (req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token not found" });
  }

  const isBlacklisted = await BlacklistToken.findOne({ token });

  if (isBlacklisted) {
    return res.status(401).json({ message: "Unauthorized: Expired token" });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    req.user = user;
    return next();

  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
}
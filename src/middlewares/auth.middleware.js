const User = require("../models/user.model");
const Mover = require("../models/mover.model");
const jwt = require("jsonwebtoken");
const BlacklistToken = require("../models/blacklistToken.model");

/* User authorization middleware */
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

/* Mover authorization middleware */
module.exports.authMover = async function (req, res, next) {
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
    const mover = await Mover.findById(decoded._id);

    req.mover = mover;
    return next();

  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
}
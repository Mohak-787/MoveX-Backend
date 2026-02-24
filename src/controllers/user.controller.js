const User = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const BlacklistToken = require("../models/blacklistToken.model");

/**
 * - User register controller
 * - POST /api/users/register
 */
async function registerUser(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, password, email } = req.body;
  const hashedPassword = await User.hashPassword(password);

  const user = await userService.createUser({
    firstName: fullName.firstName,
    lastName: fullName.lastName,
    email,
    password: hashedPassword
  });

  const token = user.generateAuthToken();

  const userObj = user.toObject();
  delete userObj.password;

  res.cookie("token", token);

  res.status(201).json({
    user: userObj,
    token
  });
}

/**
 * - User login controller
 * - POST /api/users/login
 */
async function loginUser(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Inavlid credentials" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Inavlid credentials" });
  }

  const token = user.generateAuthToken();

  const userObj = user.toObject();
  delete userObj.password;

  res.cookie("token", token);

  res.status(200).json({
    user: userObj,
    token
  });
}

/**
 * - User profile controller
 * - GET /api/users/profile
 */
async function userProfile(req, res) {
  res.status(200).json(req.user);
}

/**
 * - User logout controller
 * - POST /api/users/logout
 */
async function logoutUser(req, res) {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  await BlacklistToken.create({ token });

  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
}

module.exports = {
  registerUser,
  loginUser,
  userProfile,
  logoutUser
}
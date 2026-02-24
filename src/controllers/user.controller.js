const User = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");

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

  res.status(201).json({
    user: userObj,
    token
  });
}

module.exports = {
  registerUser
}
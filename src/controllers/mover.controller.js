const BlacklistToken = require("../models/blacklistToken.model");
const Mover = require("../models/mover.model");
const moverService = require("../services/mover.service");
const { validationResult } = require("express-validator");

/**
 * - Mover register controller
 * - POST /api/movers/register
 */
async function registerMover(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password, vehicle } = req.body;

  const existingMover = await Mover.findOne({ email });
  if (existingMover) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const hashedPassword = await Mover.hashPassword(password);

  const mover = await moverService.createMover({
    firstName: fullName.firstName,
    lastName: fullName.lastName,
    email,
    password: hashedPassword,
    color: vehicle.color,
    plate: vehicle.plate,
    capacity: vehicle.capacity,
    vehicleType: vehicle.vehicleType
  });

  const token = mover.generateAuthToken();

  const moverObj = mover.toObject();
  delete moverObj.password;

  res.cookie("token", token);
  res.status(201).json({
    mover: moverObj,
    token
  });
}

/**
 * - Mover login controller
 * - POST /api/movers/login
 */
async function loginMover(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const mover = await Mover.findOne({ email }).select("+password");
  if (!mover) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await mover.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = mover.generateAuthToken();

  const moverObj = mover.toObject();
  delete moverObj.password;

  res.cookie("token", token);
  res.status(200).json({
    mover: moverObj,
    token
  });
}

/**
 * - Mover profile controller
 * - GET /api/movers/profile
 */
async function moverProfile(req, res) {
  res.status(200).json({ mover: req.mover });
}

/**
 * - Mover logout controller
 * - POST /api/movers/logout
 */
async function logoutMover(req, res) {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  await BlacklistToken.create({ token });

  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
}

module.exports = {
  registerMover,
  loginMover,
  moverProfile,
  logoutMover
}
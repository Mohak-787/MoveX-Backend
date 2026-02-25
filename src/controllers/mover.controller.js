const Mover = require("../models/mover.model");
const moverService = require("../services/mover.service");
const { validationResult } = require("express-validator");

/**
 * - Mover register controller
 * - POST /api/mover/register
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

module.exports = {
  registerMover
}
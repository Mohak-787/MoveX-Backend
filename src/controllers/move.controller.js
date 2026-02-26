const moveService = require("../services/move.service");
const { validateResult } = require("express-validator");

/**
 * - Move create controller
 * - POST /api/moves/create
 */
const createMove = async (req, res) => {
  const errors = validateResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, pickup, destination, vehicleType } = req.body;

  try {
    const move = await moveService.createMove({ user: userId, pickup, destination, vehicleType });
    res.status(201).json(move);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/**
 * - Move fare calculation controller
 * - GET /api/moves/get-fare
 */
const getFare = async (req, res) => {
  const errors = validateResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination } = req.query;

  try {
    const fare = await moveService.getFare(pickup, destination);
    res.status(200).json(fare);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createMove,
  getFare
}
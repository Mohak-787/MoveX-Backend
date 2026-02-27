const moveService = require("../services/move.service");
const { validateResult } = require("express-validator");
const mapService = require("../services/maps.service");
const { sendMessageToSocketId } = require("../socket");
const Move = require("../models/move.model");

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

    const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
    const moversInRadius = await mapService.getMoversInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 2);
    const moveWithUser = await Move.findOne({ _id: move._id }).populate('user');

    move.otp = "";
    moversInRadius.map(mover => {
      sendMessageToSocketId(mover.socketId, {
        event: "new-move",
        data: moveWithUser
      });
    });

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

/**
 * - Move confirm move controller
 * - POST /api/moves/confirm
 */
const confirmMove = async (req, res) => {
  const errors = validateResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { moveId } = req.body;

  try {
    const move = await moveService.confirmMove({ moveId, mover: req.mover });
    res.status(200).json(move);

    sendMessageToSocketId(move.user.socketId, {
      event: 'move-confirmed',
      data: move
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/**
 * - Move start move controller
 * - GET /api/moves/start-move
 */
const startMove = async (req, res) => {
  const errors = validateResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { moveId, OTP } = req.query;

  try {
    const move = await moveService.startMove({ moveId, OTP, mover: req.mover });
    res.status(200).json(move);

    sendMessageToSocketId(move.user.socketId, {
      event: 'move-started',
      data: move
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

/**
 * - Move end move controller
 * - POST /api/moves/end-move
 */
const endMove = async (req, res) => {
  const errors = validateResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { moveId } = req.body;

  try {
    const move = await moveService.endMove({ moveId, mover: req.mover });
    res.status(200).json(move);

    sendMessageToSocketId(move.user.socketId, {
      event: 'move-ended',
      data: move
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createMove,
  getFare,
  confirmMove,
  startMove,
  endMove
}
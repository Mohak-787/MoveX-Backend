const express = require('express');
const { body, query } = require('express-validator');
const authMiddleware = require("../middlewares/auth.middleware");
const moveController = require("../controllers/move.controller");

const router = express.Router();

/* POST /api/moves/create */
router.route("/create").post(
  body('userId').isString().isLength({ min: 24 }).withMessage('Invalid user id'),
  body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
  body('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
  body('vehicleType').isIn(['car', 'bike', 'scooter']).withMessage('Invalid vehicle type'),
  authMiddleware.authUser,
  moveController.createMove
);

/* GET /api/moves/get-fare */
router.route("/get-fare").get(
  query('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
  query('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
  authMiddleware.authUser,
  moveController.getFare
);

/* POST /api/moves/confirm */
router.route("/confirm").post(
  body('moveId').isMongoId().withMessage('Invalid move id'),
  authMiddleware.authMover,
  moveController.confirmMove
);

/* GET /api/moves/start-move */
router.route("/start-move").get(
  authMiddleware.authMover,
  query('moveId').isMongoId().withMessage('Invalid move id'),
  query('OTP').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
  moveController.startMove
);

/* POST /api/moves/end-move */
router.route("/end-move").post(
  body('moveId').isMongoId().withMessage('Invalid move id'),
  authMiddleware.authMover,
  moveController.endMove
);

module.exports = router;
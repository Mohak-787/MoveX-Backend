const express = require("express");
const { body } = require("express-validator");
const moverController = require("../controllers/mover.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/* POST /api/movers/register */
router.route("/register").post([
  body('email').isEmail().withMessage('Invalid Email'),
  body('fullName.firstName').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('vehicle.color').isLength({ min: 3 }).withMessage('Color must be atleast 3 characters long'),
  body('vehicle.plate').isLength({ min: 3 }).withMessage('Plate must be at least 3 characters long'),
  body('vehicle.capacity').isInt({ min: 1 }).withMessage('Capacity must at least be 1'),
  body('vehicle.vehicleType').isIn(['car', 'bike', 'scooter']).withMessage('Invalid vehicle type, must be one of: car, bike, scooter')
], moverController.registerMover);

/* POST /api/movers/login */
router.route("/login").post([
  body('email').isEmail().withMessage('Invalid Email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], moverController.loginMover);

/* GET /api/movers/profile */
router.route("/profile").get(authMiddleware.authMover, moverController.moverProfile);

/* POST /api/movers/logout */
router.route("/logout").post(authMiddleware.authMover, moverController.logoutMover);


module.exports = router;
const express = require('express');
const authMiddleware = require("../middlewares/auth.middleware");
const mapController = require("../controllers/maps.controller");
const { query } = require("express-validator");

const router = express.Router();

/* GET /api/maps/get-coordinates */
router.route("/get-coordinates").get(
  query('address').isString().isLength({ min: 3 }).trim(),
  authMiddleware.authUser,
  mapController.getCoordinates
);

/* GET /api/maps/get-distance-time */
router.route("/get-distance-time").get(
  query('origin').isString().isLength({ min: 3 }),
  query('destination').isString().isLength({ min: 3 }),
  authMiddleware.authUser,
  mapController.getDistanceTime
);

/* GET /api/maps/get-suggestions */
router.route("/get-suggestions").get(
  query('input').isString().isLength({ min: 3 }),
  authMiddleware.authUser,
  mapController.getSuggestions
);

module.exports = router;
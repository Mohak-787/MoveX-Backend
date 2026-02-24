const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");

const router = express.Router();

/* POST /api/users/register */
router.route("/register").post([
  body('email').isEmail().withMessage('Invalid Email'),
  body('fullName.firstName').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], userController.registerUser);

/* POST /api/users/login */
router.route("/login").post([
  body('email').isEmail().withMessage('Invalid Email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], userController.loginUser);

module.exports = router;
const express = require('express');
const verifyToken = require('../middleware/authMiddleware');

const {
  postRegister,
  postLogin,
  resetPassword,
  changePassword,
  forgotPassword,
} = require('../controllers/authController');

let authRouter = express.Router();

// Register a new user
authRouter.route('/register').post(postRegister);

// Login a user
authRouter.route('/login').post(postLogin);

// Forgot password
authRouter.route('/forgot-password').post(forgotPassword);

// Reset password
authRouter.route('/reset-password/:token').post(resetPassword);

// Change password
authRouter.route('/change-password').post(verifyToken, changePassword);

module.exports = authRouter;

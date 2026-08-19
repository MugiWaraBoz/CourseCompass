const express = require('express');
const verifyToken = require('../middleware/authMiddleware');

const {
  postRegister,
  postLogin,
  resetPassword,
  showResetPassword,
  changePassword,
  forgotPassword,
  verifyUser,
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
authRouter.route('/reset-password/:token').get(showResetPassword);

// Change password
authRouter.route('/change-password').patch(verifyToken, changePassword);

// Verify email
authRouter.route('/verify-email/:token').get(verifyUser);

module.exports = authRouter;

const express = require('express');
const authController = require('../controllers/authController');
const asyncHandler = require('../middleware/asyncHandler');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const {
  registerValidation,
  loginValidation,
  refreshTokenValidation
} = require('../validators/authValidator');

const router = express.Router();

router.post('/register', registerValidation, validate, asyncHandler(authController.register));
router.post('/login', loginValidation, validate, asyncHandler(authController.login));
router.post('/refresh', refreshTokenValidation, validate, asyncHandler(authController.refreshToken));

router.get('/me', protect, asyncHandler(authController.me));

module.exports = router;

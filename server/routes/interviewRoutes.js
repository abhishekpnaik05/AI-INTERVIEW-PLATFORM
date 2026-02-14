const express = require('express');
const interviewController = require('../controllers/interviewController');
const asyncHandler = require('../middleware/asyncHandler');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { createSessionValidation } = require('../validators/interviewValidator');

const router = express.Router();

router.use(protect);

router.get('/', asyncHandler(interviewController.listSessions));
router.post('/', createSessionValidation, validate, asyncHandler(interviewController.createSession));

module.exports = router;

const express = require('express');
const behavioralController = require('../controllers/behavioralController');
const asyncHandler = require('../middleware/asyncHandler');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { createInterviewValidation } = require('../validators/behavioralValidator');

const router = express.Router();

router.use(protect);

router.get('/', asyncHandler(behavioralController.list));
router.post('/', createInterviewValidation, validate, asyncHandler(behavioralController.create));

module.exports = router;

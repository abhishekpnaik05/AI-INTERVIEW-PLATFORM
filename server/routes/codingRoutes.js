const express = require('express');
const codingController = require('../controllers/codingController');
const asyncHandler = require('../middleware/asyncHandler');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const {
  createQuestionValidation,
  submitAttemptValidation,
  questionIdParam
} = require('../validators/codingValidator');

const router = express.Router();

router.use(protect);

// Questions - all authenticated users can list and get
router.get('/questions', asyncHandler(codingController.listQuestions));
router.get('/questions/:id', ...questionIdParam, validate, asyncHandler(codingController.getQuestion));

// Create question - admin only
router.post(
  '/questions',
  authorize('admin'),
  createQuestionValidation,
  validate,
  asyncHandler(codingController.createQuestion)
);

// Attempts
router.post('/attempts', submitAttemptValidation, validate, asyncHandler(codingController.submitAttempt));
router.get('/attempts', asyncHandler(codingController.listAttempts));

module.exports = router;

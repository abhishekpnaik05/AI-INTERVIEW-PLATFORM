const { body, param } = require('express-validator');

const createQuestionValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description')
    .notEmpty()
    .withMessage('Description is required'),
  body('difficulty')
    .notEmpty()
    .withMessage('Difficulty is required')
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be easy, medium, or hard'),
  body('testCases')
    .isArray({ min: 1 })
    .withMessage('At least one test case is required'),
  body('testCases.*.input')
    .notEmpty()
    .withMessage('Test case input is required'),
  body('testCases.*.expectedOutput')
    .notEmpty()
    .withMessage('Test case expected output is required'),
  body('testCases.*.isHidden')
    .optional()
    .isBoolean()
    .withMessage('isHidden must be a boolean')
];

const submitAttemptValidation = [
  body('questionId')
    .notEmpty()
    .withMessage('Question ID is required')
    .isMongoId()
    .withMessage('Invalid question ID'),
  body('code')
    .notEmpty()
    .withMessage('Code is required'),
  body('language')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Language cannot exceed 20 characters')
];

const questionIdParam = [
  param('id').isMongoId().withMessage('Invalid question ID')
];

module.exports = {
  createQuestionValidation,
  submitAttemptValidation,
  questionIdParam
};

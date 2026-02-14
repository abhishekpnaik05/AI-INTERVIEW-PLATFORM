const { body } = require('express-validator');

const createInterviewValidation = [
  body('question')
    .trim()
    .notEmpty()
    .withMessage('Question is required')
    .isLength({ max: 500 })
    .withMessage('Question cannot exceed 500 characters'),
  body('answer')
    .notEmpty()
    .withMessage('Answer is required')
    .isLength({ max: 10000 })
    .withMessage('Answer cannot exceed 10000 characters')
];

module.exports = { createInterviewValidation };

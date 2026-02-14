const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Middleware to handle express-validator validation errors.
 * Must be placed after the route validation chain.
 */
function validate(req, res, next) {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const extracted = errors.array().map((err) => ({
    field: err.path,
    message: err.msg
  }));

  const message = extracted.map((e) => e.message).join('. ');
  return next(new ApiError(400, message, extracted));
}

module.exports = { validate };

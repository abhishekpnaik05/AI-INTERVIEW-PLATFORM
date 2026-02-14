const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let error = err;

  if (!(error instanceof ApiError)) {
    let statusCode = 500;
    let message = 'Internal Server Error';

    if (err.code === 'LIMIT_FILE_SIZE') {
      statusCode = 400;
      message = 'File too large. Maximum size is 5MB.';
    } else if (err.name === 'ValidationError') {
      statusCode = 400;
      message = Object.values(err.errors)
        .map((e) => e.message)
        .join('. ');
    } else if (err.name === 'CastError') {
      statusCode = 400;
      message = `Invalid ${err.path}: ${err.value}`;
    } else if (err.code === 11000) {
      statusCode = 409;
      message = 'Duplicate field value. Please use another value.';
    } else if (err.message) {
      message = err.message;
    }

    error = new ApiError(statusCode, message);
  }

  const statusCode = error.statusCode || 500;

  logger.error('Request error', {
    method: req.method,
    url: req.originalUrl,
    statusCode,
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
  });

  const response = {
    status: 'error',
    statusCode,
    message: error.message
  };

  if (error.details) {
    response.errors = error.details;
  }

  if (process.env.NODE_ENV !== 'production') {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
}

module.exports = errorHandler;


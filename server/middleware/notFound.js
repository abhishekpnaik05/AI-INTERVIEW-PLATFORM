function notFound(req, res, next) {
  res.status(404).json({
    status: 'error',
    statusCode: 404,
    message: `Route ${req.originalUrl} not found`
  });
}

module.exports = notFound;


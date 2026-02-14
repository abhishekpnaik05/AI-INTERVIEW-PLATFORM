const ApiError = require('../utils/ApiError');

/**
 * Role-based authorization middleware.
 * Must be used after protect() so req.user exists.
 *
 * @param  {...string} roles - Allowed roles (e.g. 'admin', 'user')
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, 'You do not have permission to perform this action.')
      );
    }

    next();
  };
}

module.exports = { authorize };

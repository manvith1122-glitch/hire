/**
 * Role-Based Access Control (RBAC) Middleware
 * Enforces server-side authorization checks.
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required for role verification.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user.role}' is not authorized to perform this action. Required: [${roles.join(', ')}]`
      });
    }

    next();
  };
};

/**
 * Check if the user is an owner of the resource or an Admin
 */
export const checkOwnershipOrAdmin = (resourceOwnerIdField = 'userId') => {
  return (req, res, next) => {
    if (req.user.role === 'ADMIN') {
      return next();
    }

    const resourceOwnerId = req.resource ? req.resource[resourceOwnerIdField] : null;
    if (resourceOwnerId && resourceOwnerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to modify or access this resource.'
      });
    }

    next();
  };
};

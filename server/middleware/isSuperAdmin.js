import AppError from '../utils/appErorr.js';

const isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return next(new AppError('Super Admin access required', 403));
};

export default isSuperAdmin; 
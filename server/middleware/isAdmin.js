import AppError from '../utils/appErorr.js';

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return next(new AppError('Admin access required', 403));
};

export default isAdmin; 
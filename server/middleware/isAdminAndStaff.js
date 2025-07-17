import AppError from "../utils/appErorr.js"

const isAdminAndStaff = (req, res, next) => {
  if ((req.user && req.user.role === "admin") || req.user.role === "staff") {
    return next()
  }
  return next(new AppError("Admin or Staff access required", 403))
}

export default isAdminAndStaff

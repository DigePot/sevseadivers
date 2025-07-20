import { Enrollment, Course, User } from '../models/index.js';
import tryCatch from '../utils/tryCatch.js';
import AppError from '../utils/appErorr.js';

// ✅ Create an enrollment
export const createEnrollment = tryCatch(async (req, res, next) => {
  // Get userId from the authenticated user (JWT)
  const userId = req.user.id;
  const { courseId, paymentMethod, amount, currency } = req.body;

  if (!userId || !courseId) {
    return next(new AppError('userId and courseId are required', 400));
  }

  const course = await Course.findByPk(courseId);
  if (!course) {
    return next(new AppError('Course not found', 404));
  }

  const existingEnrollment = await Enrollment.findOne({ where: { userId, courseId } });
  if (existingEnrollment) {
    return next(new AppError('Already enrolled in this course', 400));
  }

  const enrollment = await Enrollment.create({
    userId,
    courseId,
    paymentMethod,
    amount,
    currency,
    status: 'paid',
  });

  res.status(201).json({ success: true, data: enrollment });
});

// ✅ Get all enrollments (admin)
export const getAllEnrollments = tryCatch(async (req, res, next) => {
  const enrollments = await Enrollment.findAll({
    include: [User, Course],
    order: [['createdAt', 'DESC']],
  });

  res.json({ success: true, data: enrollments });
});

// ✅ Get enrollments for a specific user
export const getUserEnrollments = tryCatch(async (req, res, next) => {
  const userId = req.user.id; 
  const enrollments = await Enrollment.findAll({
    where: { userId },
    include: [Course],
    order: [['createdAt', 'DESC']],
  });
  res.json({ success: true, data: enrollments });
});

// ✅ Get single enrollment by ID
export const getEnrollmentById = tryCatch(async (req, res, next) => {
  const { id } = req.params;

  const enrollment = await Enrollment.findByPk(id, {
    include: [Course, User],
  });

  if (!enrollment) {
    return next(new AppError('Enrollment not found', 404));
  }

  res.json({ success: true, data: enrollment });
});

// ✅ Delete enrollment
export const deleteEnrollment = tryCatch(async (req, res, next) => {
  const { id } = req.params;

  const enrollment = await Enrollment.findByPk(id);
  if (!enrollment) {
    return next(new AppError('Enrollment not found', 404));
  }

  await enrollment.destroy();
  res.json({ success: true, message: 'Enrollment deleted' });
});

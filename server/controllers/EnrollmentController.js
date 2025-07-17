import { Enrollment, Course, User } from '../models/index.js';
import tryCatch from '../utils/tryCatch.js';
import AppError from '../utils/appErorr.js';

// Create an enrollment
export const createEnrollment = tryCatch(async (req, res, next) => {
  const { userId, courseId, paymentMethod } = req.body;
  if (!userId || !courseId) {
    return next(new AppError('userId and courseId are required', 400));
  }
  const course = await Course.findByPk(courseId);
  if (!course) return next(new AppError('Course not found', 404));
  // Optionally check if already enrolled
  const exists = await Enrollment.findOne({ where: { userId, courseId } });
  if (exists) return next(new AppError('Already enrolled in this course', 400));
  const enrollment = await Enrollment.create({ userId, courseId, paymentMethod, status: 'paid' });
  res.status(201).json(enrollment);
});

// Get all enrollments (admin/staff)
export const getAllEnrollments = tryCatch(async (req, res, next) => {
  const enrollments = await Enrollment.findAll({
    include: [User, Course],
    order: [['createdAt', 'DESC']],
  });
  res.json(enrollments);
});

// Get all enrollments for a user
export const getUserEnrollments = tryCatch(async (req, res, next) => {
  const { userId } = req.params;
  const enrollments = await Enrollment.findAll({
    where: { userId },
    include: [Course],
    order: [['createdAt', 'DESC']],
  });
  res.json(enrollments);
});

// Get enrollment by ID
export const getEnrollmentById = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const enrollment = await Enrollment.findByPk(id, {
    include: [Course, User],
  });
  if (!enrollment) return next(new AppError('Enrollment not found', 404));
  res.json(enrollment);
});

// Delete an enrollment
export const deleteEnrollment = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const enrollment = await Enrollment.findByPk(id);
  if (!enrollment) return next(new AppError('Enrollment not found', 404));
  await enrollment.destroy();
  res.json({ message: 'Enrollment deleted' });
});

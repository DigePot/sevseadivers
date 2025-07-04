import express from 'express';
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
} from '../controllers/CourseController.js';
import authenticateToken from '../middleware/auth.js';
import isAdmin from '../middleware/isAdmin.js';

const router = express.Router();

router.post('/', authenticateToken, isAdmin, createCourse);
router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.put('/:id', authenticateToken, isAdmin, updateCourse);
router.delete('/:id', authenticateToken, isAdmin, deleteCourse);

export default router; 
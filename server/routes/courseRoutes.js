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
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/add', authenticateToken, isAdmin, upload.single('media'), createCourse);
router.get('/all', getAllCourses);
router.get('/:id', getCourseById);
router.put('/:id', authenticateToken, isAdmin, upload.single('media'), updateCourse);
router.delete('/:id', authenticateToken, isAdmin, deleteCourse);

export default router; 
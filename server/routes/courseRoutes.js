import express from "express"
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
} from "../controllers/CourseController.js"
import authenticateToken from "../middleware/auth.js"
import isAdminAndStaff from "../middleware/isAdminAndStaff.js"
import { uploadMultiple } from "../middleware/upload.js"
import multer from "multer"

const router = express.Router()

// Request logging middleware
router.use((req, res, next) => {
  console.log(`[Course Routes] ${req.method} ${req.path}`, {
    body: req.body,
    files: req.files,
    headers: req.headers
  });
  next();
});

// Test endpoint to verify route is working
router.get("/test", (req, res) => {
  res.json({ message: "Course routes are working" });
});

// Error handling middleware for upload errors
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('Multer error:', err);
    return res.status(400).json({ 
      error: 'File upload error', 
      message: err.message 
    });
  } else if (err) {
    console.error('Upload error:', err);
    return res.status(400).json({ 
      error: 'File upload error', 
      message: err.message 
    });
  }
  next();
};

router.post(
  "/add",
  authenticateToken,
  isAdminAndStaff,
  uploadMultiple,
  handleUploadError,
  createCourse
)
router.get("/all", getAllCourses)
router.get("/:id", getCourseById)
router.put(
  "/:id",
  authenticateToken,
  isAdminAndStaff,
  uploadMultiple,
  handleUploadError,
  updateCourse
)
router.delete("/:id", authenticateToken, isAdminAndStaff, deleteCourse)

export default router

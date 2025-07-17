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
import upload from "../middleware/upload.js"

const router = express.Router()

router.post(
  "/add",
  authenticateToken,
  isAdminAndStaff,
  upload.single("media"),
  createCourse
)
router.get("/all", getAllCourses)
router.get("/:id", getCourseById)
router.put(
  "/:id",
  authenticateToken,
  isAdminAndStaff,
  upload.single("media"),
  updateCourse
)
router.delete("/:id", authenticateToken, isAdminAndStaff, deleteCourse)

export default router

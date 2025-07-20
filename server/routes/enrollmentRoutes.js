import express from "express";
import {
  createEnrollment,
  getAllEnrollments,
  getUserEnrollments,
  getEnrollmentById,
  deleteEnrollment,
} from "../controllers/EnrollmentController.js";
import authenticateToken from "../middleware/auth.js";


const router = express.Router();



router.post("/add", authenticateToken, createEnrollment);
router.get("/my", authenticateToken, getUserEnrollments);
router.get("/:id", getEnrollmentById);
router.delete("/:id", deleteEnrollment);

export default router;

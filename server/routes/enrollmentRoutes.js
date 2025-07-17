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

router.use(authenticateToken);

router.post("/", createEnrollment);
router.get("/", getUserEnrollments); // or getAllEnrollments if admin
router.get("/:id", getEnrollmentById);
router.delete("/:id", deleteEnrollment);

export default router;

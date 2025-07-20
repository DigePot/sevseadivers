import express from "express";
import { getAllStaff, getStaffById } from "../controllers/AdminDashboardController.js";

const router = express.Router();
router.get("/", getAllStaff);
router.get("/:id", getStaffById);

export default router;
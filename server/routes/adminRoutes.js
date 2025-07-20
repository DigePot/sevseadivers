import express from "express"
import {
  // Analytics & Reports
  getDashboardStats,
  getAnalytics,
  generateReport,

  // Staff Management
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffPerformance,
} from "../controllers/AdminDashboardController.js"
import authenticateToken from "../middleware/auth.js"
import isAdmin from "../middleware/isAdmin.js"
import upload from "../middleware/upload.js"

const router = express.Router()

// ==================== ANALYTICS & REPORTS ====================

// Dashboard overview statistics
router.get("/dashboard/stats", authenticateToken, isAdmin, getDashboardStats)

// Detailed analytics with period filtering
router.get("/analytics", authenticateToken, isAdmin, getAnalytics)

// Generate comprehensive reports
router.get("/reports", authenticateToken, isAdmin, generateReport)

// ==================== STAFF MANAGEMENT ====================

// Get all staff members (admin/staff can view)
router.get("/staff", authenticateToken, isAdmin, getAllStaff)
router.get("/staff/:id", authenticateToken, isAdmin, getStaffById)

// Create new staff member (admin only)
router.post("/staff", upload.single('profilePicture'), authenticateToken, isAdmin, createStaff)

// Update staff member (admin only)
router.put("/staff/:id", upload.single('profilePicture'),  authenticateToken, isAdmin, updateStaff)

// Delete staff member (admin only)
router.delete("/staff/:id", authenticateToken, isAdmin, deleteStaff)

// Get staff performance metrics
router.get(
  "/staff/:staffId/performance",
  authenticateToken,
  isAdmin,
  getStaffPerformance
)

export default router

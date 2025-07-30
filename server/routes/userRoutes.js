import express from "express"
import {
  register,
  login,
  logout,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
  contact,
} from "../controllers/UserController.js"
import authenticateToken from "../middleware/auth.js"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.get("/", authenticateToken, getAllUsers)
router.get("/:id", authenticateToken, getUserById)
router.put("/:id", authenticateToken, updateUser)
router.delete("/:id", authenticateToken, deleteUser)
router.post("/send-otp", sendOtp)
router.post("/verify-otp", verifyOtp)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)
router.post("/contact", contact) // contact

export default router

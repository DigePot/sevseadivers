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
<<<<<<< HEAD
  contact,
=======
>>>>>>> b8ee2abcd2348429b4c64c04c7fb14dbcd77c4cd
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
<<<<<<< HEAD
router.post("/contact", contact) // contact
=======
// router.post("/contact")
>>>>>>> b8ee2abcd2348429b4c64c04c7fb14dbcd77c4cd

export default router

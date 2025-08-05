import express from "express"
import {
  createRental,
  getAllRental,
  getRentalById,
  updateRental,
  deleteRental,
} from "../controllers/RentalController.js"
import authenticateToken from "../middleware/auth.js"
import isAdminAndStaff from "../middleware/isAdminAndStaff.js"
import upload from "../middleware/upload.js"

const router = express.Router()

router.post(
  "/",
  authenticateToken,
  isAdminAndStaff,
  upload.single("media"),
  createRental
)
router.get("/", getAllRental)
router.get("/:id", getRentalById)
router.put(
  "/:id",
  authenticateToken,
  isAdminAndStaff,
  upload.single("media"),
  updateRental
)
router.delete("/:id", authenticateToken, isAdminAndStaff, deleteRental)

export default router

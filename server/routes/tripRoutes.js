import express from "express"
import {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} from "../controllers/TripController.js"
import authenticateToken from "../middleware/auth.js"
import isAdminAndStaff from "../middleware/isAdminAndStaff.js"
import upload from "../middleware/upload.js"

const router = express.Router()

router.post(
  "/",
  authenticateToken,
  isAdminAndStaff,
  upload.single("media"),
  createTrip
)
router.get("/", getAllTrips)
router.get("/:id", getTripById)
router.put(
  "/:id",
  authenticateToken,
  isAdminAndStaff,
  upload.single("media"),
  updateTrip
)
router.delete("/:id", authenticateToken, isAdminAndStaff, deleteTrip)

export default router

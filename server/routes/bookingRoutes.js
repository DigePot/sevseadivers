import express from "express"
import {
  createBooking,
  getAllBookings,
  getAllBookingsForUser,
  getBookingById,
  cancelBooking,
  deleteBooking,
  updateBookingStatus,
} from "../controllers/BookingController.js"

const router = express.Router()

router.post("/", createBooking)
router.get("/", getAllBookings) // route for admin/staff
router.get("/user/:userId", getAllBookingsForUser)
router.get("/:id", getBookingById)
router.patch("/:id/cancel", cancelBooking)
router.delete("/:id", deleteBooking)
router.put("/status/:id", updateBookingStatus)

export default router

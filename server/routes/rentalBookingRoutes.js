import express from "express"
import {
  createRentalBooking,
  completeRental,
  handleRentalPaymentWebhook,
  getUserRentalBookings,
} from "../controllers/rentalBookingController.js"
import authenticateToken from "../middleware/auth.js"

const router = express.Router()

router.post("/", authenticateToken, createRentalBooking)
router.patch("/:bookingId/complete", authenticateToken, completeRental)
router.get("/my-bookings", authenticateToken, getUserRentalBookings)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleRentalPaymentWebhook
)

export default router

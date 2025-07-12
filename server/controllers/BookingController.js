import { Booking, Course, User } from "../models/index.js"
import tryCatch from "../utils/tryCatch.js"
import AppError from "../utils/appErorr.js"

// Create a booking
export const createBooking = tryCatch(async (req, res, next) => {
  const { userId, courseId } = req.body
  if (!userId || !courseId) {
    return next(new AppError("userId and courseId are required", 400))
  }
  const course = await Course.findByPk(courseId)
  if (!course) return next(new AppError("Course not found", 404))
  const booking = await Booking.create({ userId, courseId })
  res.status(201).json(booking)
})

// ✅ Get all bookings (admin/staff)
export const getAllBookings = tryCatch(async (req, res, next) => {
  const bookings = await Booking.findAll({
    include: [User, Course],
    order: [["createdAt", "DESC"]],
  })
  res.json(bookings)
})

// Get all bookings for a user
export const getAllBookingsForUser = tryCatch(async (req, res, next) => {
  const { userId } = req.params
  const bookings = await Booking.findAll({
    where: { userId },
    include: [Course],
    order: [["createdAt", "DESC"]],
  })
  res.json(bookings)
})

// Get booking by ID
export const getBookingById = tryCatch(async (req, res, next) => {
  const { id } = req.params
  const booking = await Booking.findByPk(id, {
    include: [Course, User],
  })
  if (!booking) return next(new AppError("Booking not found", 404))
  res.json(booking)
})

// Cancel a booking
export const cancelBooking = tryCatch(async (req, res, next) => {
  const { id } = req.params
  const booking = await Booking.findByPk(id)
  if (!booking) return next(new AppError("Booking not found", 404))
  booking.status = "cancelled"
  await booking.save()
  res.json({ message: "Booking cancelled", booking })
})

// Delete a booking
export const deleteBooking = tryCatch(async (req, res, next) => {
  const { id } = req.params
  const booking = await Booking.findByPk(id)
  if (!booking) return next(new AppError("Booking not found", 404))
  await booking.destroy()
  res.json({ message: "Booking deleted" })
})

export const updateBookingStatus = tryCatch(async (req, res, next) => {
  const { id } = req.params
  const { status } = req.body
  if (!status) {
    return next(new AppError("Status is required", 400))
  }

  const booking = await Booking.findByPk(id)
  if (!booking) return next(new AppError("Booking not found", 404))

  const validStatuses = ["pending", "completed", "cancelled"]
  if (!validStatuses.includes(status)) {
    return next(
      new AppError(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        400
      )
    )
  }

  booking.status = status
  await booking.save()

  res.json({
    message: "Booking status updated",
    booking,
  })
})

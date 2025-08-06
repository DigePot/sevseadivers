import { Rental, RentalBooking } from "../models/index.js"
import tryCatch from "../utils/tryCatch.js"
import AppError from "../utils/appErorr.js"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const createRentalBooking = tryCatch(async (req, res, next) => {
  const { rentalId } = req.body
  const userId = req.user.id

  if (!rentalId) {
    return next(new AppError("Rental ID is required", 400))
  }

  const rental = await Rental.findByPk(rentalId)
  if (!rental) return next(new AppError("Rental not found", 404))

  // Check rental availability
  if (rental.status !== "available") {
    return next(new AppError("This rental is not available", 400))
  }

  // Create booking
  const booking = await RentalBooking.create({
    rentalId,
    userId,
    paymentStatus: "pending",
  })

  // Create Stripe payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(rental.price * 100),
    currency: "eur",
    metadata: {
      bookingId: booking.id,
      userId,
      rentalId,
    },
    description: `Rental: ${rental.title} (${rental.duration})`,
  })

  // Update booking with payment intent
  await booking.update({
    paymentIntentId: paymentIntent.id,
  })

  // Update rental status to "rented"
  await rental.update({ status: "rented" })

  res.status(201).json({
    status: "success",
    clientSecret: paymentIntent.client_secret,
    bookingId: booking.id,
  })
})

export const completeRental = tryCatch(async (req, res, next) => {
  const { bookingId } = req.params

  const booking = await RentalBooking.findByPk(bookingId, {
    include: [Rental],
  })

  if (!booking) return next(new AppError("Booking not found", 404))
  if (booking.status === "completed") {
    return next(new AppError("Rental already completed", 400))
  }

  // Update booking and rental status
  await Promise.all([
    booking.update({ status: "completed" }),
    booking.Rental.update({ status: "available" }),
  ])

  res.status(200).json({
    status: "success",
    message: "Rental marked as completed",
  })
})

export const handleRentalPaymentWebhook = tryCatch(async (req, res) => {
  const sig = req.headers["stripe-signature"]
  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error(`❌ Webhook Error: ${err.message}`)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle payment success
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object
    const bookingId = paymentIntent.metadata.bookingId

    const booking = await RentalBooking.findByPk(bookingId)
    if (booking && booking.paymentStatus === "pending") {
      await booking.update({ paymentStatus: "paid" })
    }
  }

  res.status(200).json({ received: true })
})

export const getUserRentalBookings = tryCatch(async (req, res) => {
  const userId = req.user.id

  const bookings = await RentalBooking.findAll({
    where: { userId },
    include: [
      {
        model: Rental,
        attributes: ["id", "title", "imageUrl", "price", "duration"],
      },
    ],
    order: [["bookingDate", "DESC"]],
  })

  res.status(200).json({
    status: "success",
    data: { bookings },
  })
})

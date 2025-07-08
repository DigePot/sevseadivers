import { Trip } from "../models/index.js"
import tryCatch from "../utils/tryCatch.js"
import AppError from "../utils/appErorr.js"

export const createTrip = tryCatch(async (req, res, next) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`
  const {
    title,
    description,
    imageUrl,
    destination,
    date,
    activityType,
    price,
    duration,
  } = req.body
  if (!title || !description || !destination || !activityType || !price) {
    return next(
      new AppError(
        "Title, description, destination, activityType, and price are required",
        400
      )
    )
  }
  const trip = await Trip.create({
    title,
    description,
    imageUrl: req.file ? `${baseUrl}/upload/${req.file.filename}` : undefined, // Full image URL
    destination,
    date,
    activityType,
    price,
    duration,
  })
  res.status(201).json(trip)
})

export const getAllTrips = tryCatch(async (req, res) => {
  const trips = await Trip.findAll()
  res.json(trips)
})

export const getTripById = tryCatch(async (req, res, next) => {
  const trip = await Trip.findByPk(req.params.id)
  if (!trip) return next(new AppError("Trip not found", 404))
  res.json(trip)
})

export const updateTrip = tryCatch(async (req, res, next) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`

  const trip = await Trip.findByPk(req.params.id)
  if (!trip) return next(new AppError("Trip not found", 404))
  const {
    title,
    description,
    imageUrl,
    destination,
    date,
    activityType,
    price,
    duration,
  } = req.body
  await trip.update({
    title,
    description,
    // imageUrl,
    imageUrl: req.file ? `${baseUrl}/upload/${req.file.filename}` : undefined, // Full image URL
    destination,
    date,
    activityType,
    price,
    duration,
  })
  res.json(trip)
})

export const deleteTrip = tryCatch(async (req, res, next) => {
  const trip = await Trip.findByPk(req.params.id)
  if (!trip) return next(new AppError("Trip not found", 404))
  await trip.destroy()
  res.json({ message: "Trip deleted" })
})

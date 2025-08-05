import { Rental } from "../models/index.js"
import tryCatch from "../utils/tryCatch.js"
import AppError from "../utils/appErorr.js"

import path from "path"
import { promises as fs } from "fs"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const createRental = tryCatch(async (req, res, next) => {
  const { title, description, price, duration, status, location } = req.body

  if (!title || !description || !price) {
    return next(
      new AppError("Title, description, and price are required.", 400)
    )
  }

  const userId = req.user.id

  let imageUrl = null
  if (req.file) {
    const baseUrl = `${req.protocol}://${req.get("host")}`
    imageUrl = `${baseUrl}/upload/${req.file.filename}`
  }

  const newRental = await Rental.create({
    title,
    description,
    price: parseFloat(price),
    duration,
    status,
    imageUrl,
    location,
    userId,
  })

  res.status(201).json({
    status: "success",
    data: { newRental },
  })
})

export const getAllRental = tryCatch(async (req, res) => {
  const rentals = await Rental.findAll({
    order: [["createdAt", "DESC"]],
  })

  res.status(200).json({
    status: "success",
    results: rentals.length,
    data: {
      rentals,
    },
  })
})

export const getRentalById = tryCatch(async (req, res, next) => {
  const { id } = req.params
  const rental = await Rental.findByPk(id, {})
  if (!rental) {
    return next(new AppError(`No rental found with ID: ${id}`, 404))
  }

  res.status(200).json({
    status: "success",
    data: {
      rental,
    },
  })
})

export const updateRental = tryCatch(async (req, res, next) => {
  const { id } = req.params
  const rental = await Rental.findByPk(id)
  if (!rental) {
    return next(new AppError(`No rental found with ID: ${id}`, 404))
  }

  if (req.file) {
    // If there's an old image, delete it from the server
    if (rental.imageUrl) {
      try {
        const oldImageFilename = rental.imageUrl.split("/").pop()
        const oldImagePath = path.join(
          __dirname,
          "..",
          "upload",
          oldImageFilename
        )
        await fs.unlink(oldImagePath)
      } catch (err) {
        console.error("Failed to delete old image:", err.message)
      }
    }
    // Set the new image URL
    const baseUrl = `${req.protocol}://${req.get("host")}`
    req.body.imageUrl = `${baseUrl}/upload/${req.file.filename}`
  }

  const updatedRental = await rental.update(req.body)

  res.status(200).json({
    status: "success",
    data: { updatedRental },
  })
})

export const deleteRental = tryCatch(async (req, res, next) => {
  const { id } = req.params
  const rental = await Rental.findByPk(id)

  if (!rental) {
    return next(new AppError(`No rental found with ID: ${id}`, 404))
  }

  // If the rental has an image, delete it from the server
  if (rental.imageUrl) {
    try {
      const imageFilename = rental.imageUrl.split("/").pop()
      const imagePath = path.join(__dirname, "..", "upload", imageFilename)
      await fs.unlink(imagePath)
    } catch (err) {
      console.error("Failed to delete rental image:", err.message)
    }
  }

  await rental.destroy()

  res.status(204).json({
    status: "success",
    data: "success",
  })
})

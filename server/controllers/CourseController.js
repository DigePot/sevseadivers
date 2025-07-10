import { Course } from "../models/index.js"
import tryCatch from "../utils/tryCatch.js"
import AppError from "../utils/appErorr.js"

export const createCourse = tryCatch(async (req, res, next) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`
  const { title, description, price, duration } = req.body
  let imageUrl = req.body.imageUrl

  if (req.file) {
    imageUrl = `/upload/${req.file.filename}`
  }
  if (!title || !description || !price || !duration) {
    return next(
      new AppError("Title, description, price, and duration are required", 400)
    )
  }
  const course = await Course.create({
    title,
    description,
    // imageUrl,
    imageUrl: req.file ? `${baseUrl}/upload/${req.file.filename}` : undefined, // Full image URL
    price,
    duration,
  })
  res.status(201).json(course)
})

export const getAllCourses = tryCatch(async (req, res) => {
  const courses = await Course.findAll()
  res.json(courses)
})

export const getCourseById = tryCatch(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id)
  if (!course) return next(new AppError("Course not found", 404))
  res.json(course)
})

export const updateCourse = tryCatch(async (req, res, next) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`
  const course = await Course.findByPk(req.params.id)
  if (!course) return next(new AppError("Course not found", 404))
  const { title, description, imageUrl, price, duration } = req.body
  await course.update({
    title,
    description,
    // imageUrl,
    imageUrl: req.file ? `${baseUrl}/upload/${req.file.filename}` : undefined, // Full image URL
    price,
    duration,
  })
  res.json(course)
})

export const deleteCourse = tryCatch(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id)
  if (!course) return next(new AppError("Course not found", 404))
  await course.destroy()
  res.json({ message: "Course deleted" })
})

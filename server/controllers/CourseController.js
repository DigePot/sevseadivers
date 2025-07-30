import { Course } from "../models/index.js"
import tryCatch from "../utils/tryCatch.js"
import AppError from "../utils/appErorr.js"

export const createCourse = tryCatch(async (req, res, next) => {
  console.log("=== Course Creation Request ===")
  console.log("Body:", req.body)
  console.log("Files:", req.files)

  const baseUrl = `https://${req.get("host")}`

  // Extract data from request body
  const {
    title,
    description,
    price,
    duration,
    category,
    level,
    instructorName,
    instructorBio,
    instructorRating,
    learnPoints,
    includes,
  } = req.body

  console.log("Extracted data:", {
    title,
    description,
    price,
    duration,
    category,
    level,
    instructorName,
    instructorBio,
    instructorRating,
    learnPoints,
    includes,
  })

  // Handle file uploads
  let imageUrl = null
  let instructorImageUrl = null
  let videoUrl = null

  // Check for uploaded files
  if (req.files) {
    console.log("Processing files:", Object.keys(req.files))

    // Handle course image
    if (req.files.courseImage) {
      imageUrl = `${baseUrl}/upload/${req.files.courseImage[0].filename}`
      console.log("Course image URL:", imageUrl)
    }

    // Handle instructor image
    if (req.files.instructorImage) {
      instructorImageUrl = `${baseUrl}/upload/${req.files.instructorImage[0].filename}`
      console.log("Instructor image URL:", instructorImageUrl)
    }

    // Handle curriculum video
    if (req.files.curriculumVideo) {
      videoUrl = `${baseUrl}/upload/${req.files.curriculumVideo[0].filename}`
      console.log("Curriculum video URL:", videoUrl)
    }
  }

  // Validation
  if (!title || !description || !category || !level || !instructorName) {
    console.log("Validation failed - missing required fields")
    return next(
      new AppError(
        "Title, description, category, level, and instructor name are required",
        400
      )
    )
  }

  // Parse learnPoints if it's a string
  let parsedLearnPoints = []
  if (learnPoints) {
    try {
      // If learnPoints is already an array, use it directly
      if (Array.isArray(learnPoints)) {
        parsedLearnPoints = learnPoints
      } else {
        // If it's a string, try to parse it
        parsedLearnPoints = JSON.parse(learnPoints)
      }
    } catch (error) {
      console.error("Error parsing learnPoints:", error)
      parsedLearnPoints = []
    }
  } else {
    // Handle FormData array format (learnPoints[0], learnPoints[1], etc.)
    const learnPointsArray = []
    for (let key in req.body) {
      if (key.startsWith("learnPoints[") && key.endsWith("]")) {
        const value = req.body[key]
        if (value && value.trim()) {
          learnPointsArray.push(value.trim())
        }
      }
    }
    parsedLearnPoints = learnPointsArray
    console.log("Extracted learn points from FormData:", parsedLearnPoints)
  }
  // Handle includes// Parse includes if provided
  let parsedIncludes = []
  if (includes) {
    try {
      parsedIncludes = Array.isArray(includes) ? includes : JSON.parse(includes)
    } catch (err) {
      console.error("Error parsing includes:", err)
      parsedIncludes = []
    }
  } else {
    const includesArray = []
    for (let key in req.body) {
      if (key.startsWith("includes[") && key.endsWith("][icon]")) {
        const index = key.match(/includes\[(\d+)\]/)[1]
        const icon = req.body[`includes[${index}][icon]`]
        const text = req.body[`includes[${index}][text]`]
        if (icon && text) {
          includesArray.push({ icon, text })
        }
      }
    }
    parsedIncludes = includesArray
  }

  try {
    const course = await Course.create({
      title,
      description,
      imageUrl,
      price: price ? parseFloat(price) : 0,
      duration: duration || "",
      category,
      level,
      instructorName,
      instructorBio: instructorBio || "",
      instructorRating: instructorRating ? parseFloat(instructorRating) : 0,
      instructorImage: instructorImageUrl,
      videoUrl,
      whatYouWillLearn: parsedLearnPoints,
      includes: parsedIncludes,
    })

    console.log("Course created successfully:", course.id)
    res.status(201).json(course)
  } catch (error) {
    console.error("Database error creating course:", error)
    return next(new AppError(`Failed to create course: ${error.message}`, 500))
  }
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
  const baseUrl = `https://${req.get("host")}`
  const course = await Course.findByPk(req.params.id)
  if (!course) return next(new AppError("Course not found", 404))
  const {
    title,
    description,
    imageUrl,
    price,
    duration,
    category,
    level,
    instructorName,
  } = req.body
  await course.update({
    title,
    description,
    // imageUrl,
    imageUrl: req.file ? `${baseUrl}/upload/${req.file.filename}` : undefined, // Full image URL
    price,
    duration,
    category,
    level,
    instructorName,
  })
  res.json(course)
})

export const deleteCourse = tryCatch(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id)
  if (!course) return next(new AppError("Course not found", 404))
  await course.destroy()
  res.json({ message: "Course deleted" })
})

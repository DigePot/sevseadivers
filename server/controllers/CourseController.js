import { Course } from "../models/index.js"
import tryCatch from "../utils/tryCatch.js"
import AppError from "../utils/appErorr.js"

export const createCourse = tryCatch(async (req, res, next) => {
  const baseUrl = `https://${req.get("host")}`

  const {
    title,
    description,
    price,
    discountedPrice,
    duration,
    category,
    level,
    instructorName,
    instructorBio,
    instructorRating,
    whatYouWillLearn: learnPoints, // Frontend sends this as learnPoints
    includes,
    prerequisites,
    minAge,
  } = req.body

  // Initialize media URLs
    let imageUrl = req.body.imageUrl
  let instructorImageUrl = req.body.instructorImageUrl
  let videoUrl = req.body.videoUrl

  // File handling
  if (req.files) {
    if (req.files.courseImage?.[0]) {
      imageUrl = `${baseUrl}/upload/${req.files.courseImage[0].filename}`
       console.log("Course image URL:", imageUrl)
    }
    if (req.files.instructorImage?.[0]) {
      instructorImageUrl = `${baseUrl}/upload/${req.files.instructorImage[0].filename}`
    }
    if (req.files.curriculumVideo?.[0]) {
      videoUrl = `${baseUrl}/upload/${req.files.curriculumVideo[0].filename}`
    }
  }

  // Required field validation
  if (!title || !description || !category || !level || !instructorName ) {
    return next(
      new AppError("Title, description, category, level, instructor name and image are required", 400)
    )
  }

  // Parse learnPoints -> whatYouWillLearn
  let parsedLearnPoints = []
  try {
    if (learnPoints) {
      parsedLearnPoints = Array.isArray(learnPoints)
        ? learnPoints
        : JSON.parse(learnPoints)
    } else {
      // Handle FormData: learnPoints[0], learnPoints[1]...
      parsedLearnPoints = Object.keys(req.body)
        .filter((key) => key.startsWith("learnPoints["))
        .map((key) => req.body[key]?.trim())
        .filter(Boolean)
    }
  } catch (err) {
    console.error("Error parsing learnPoints:", err)
    parsedLearnPoints = []
  }

  // Parse includes
  let parsedIncludes = []
  try {
    if (includes) {
      parsedIncludes = Array.isArray(includes) ? includes : JSON.parse(includes)
    } else {
      // Handle FormData: includes[0][icon], includes[0][text]
      const map = {}
      Object.keys(req.body).forEach((key) => {
        const match = key.match(/includes\[(\d+)\]\[(icon|text)\]/)
        if (match) {
          const [_, index, type] = match
          if (!map[index]) map[index] = {}
          map[index][type] = req.body[key]
        }
      })
      parsedIncludes = Object.values(map).filter(item => item.icon && item.text)
    }
  } catch (err) {
    console.error("Error parsing includes:", err)
    parsedIncludes = []
  }
    // Parse prerequisites
  let parsedPrerequisites = []
  try {
    if (prerequisites) {
      parsedPrerequisites = Array.isArray(prerequisites)
        ? prerequisites
        : JSON.parse(prerequisites)
    } else {
      parsedPrerequisites = Object.keys(req.body)
        .filter((key) => key.startsWith("prerequisites["))
        .map((key) => req.body[key]?.trim())
        .filter(Boolean)
    }
  } catch (err) {
    console.error("Error parsing prerequisites:", err)
    parsedPrerequisites = []
  }

  // Create course
  try {
    const course = await Course.create({
      title,
      description,
      imageUrl,
      price: price ? parseFloat(price) : 0,
      discountedPrice: discountedPrice ? parseFloat(discountedPrice) : null,
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
      prerequisites: parsedPrerequisites,
      minAge: minAge ? parseInt(minAge) : null,
    })

    console.log("✅ Course created:", course.id)
    res.status(201).json(course)
  } catch (error) {
    console.error("❌ DB error:", error)
    return next(new AppError(`Failed to create course: ${error.message}`, 500))
  }
})

export const getAllCourses = tryCatch(async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Something went wrong while fetching courses." });
  }
});

export const getCourseById = tryCatch(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id)
  if (!course) return next(new AppError("Course not found", 404))
  res.json(course)
})

export const updateCourse = tryCatch(async (req, res, next) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`
  
  const course = await Course.findByPk(req.params.id)
  if (!course) return next(new AppError("Course not found", 404))

  console.log("📝 Update request body:", req.body) // Debug log

  const {
    title,
    description,
    price,
    discountedPrice,
    duration,
    category,
    level,
    instructorName,
    instructorBio,
    instructorRating,
    whatYouWillLearn: learnPoints, // Frontend sends this as learnPoints
    includes,
    prerequisites,
    minAge,
  } = req.body

  // Initialize media URLs - keep existing if no new files
  let imageUrl = course.imageUrl
  let instructorImageUrl = course.instructorImage
  let videoUrl = course.videoUrl

  // File handling
  if (req.files) {
    if (req.files.courseImage?.[0]) {
      imageUrl = `${baseUrl}/upload/${req.files.courseImage[0].filename}`
    }
    if (req.files.instructorImage?.[0]) {
      instructorImageUrl = `${baseUrl}/upload/${req.files.instructorImage[0].filename}`
    }
    if (req.files.curriculumVideo?.[0]) {
      videoUrl = `${baseUrl}/upload/${req.files.curriculumVideo[0].filename}`
    }
  }

  // Parse learnPoints -> whatYouWillLearn
  let parsedLearnPoints = course.whatYouWillLearn || []
  try {
    if (learnPoints !== undefined) {
      if (Array.isArray(learnPoints)) {
        parsedLearnPoints = learnPoints.filter(point => point && point.trim() !== "")
      } else if (typeof learnPoints === 'string' && learnPoints.trim() !== "") {
        parsedLearnPoints = JSON.parse(learnPoints).filter(point => point && point.trim() !== "")
      } else {
        // Handle FormData: learnPoints[0], learnPoints[1]...
        const formDataLearnPoints = Object.keys(req.body)
          .filter((key) => key.startsWith("learnPoints["))
          .map((key) => req.body[key]?.trim())
          .filter(Boolean)
        
        if (formDataLearnPoints.length > 0) {
          parsedLearnPoints = formDataLearnPoints
        }
      }
    }
  } catch (err) {
    console.error("Error parsing learnPoints:", err)
    // Keep existing data on parse error
  }

  // Parse includes
  let parsedIncludes = course.includes || []
  try {
    if (includes !== undefined) {
      if (Array.isArray(includes)) {
        parsedIncludes = includes.filter(item => item.icon && item.text && item.icon.trim() !== "" && item.text.trim() !== "")
      } else if (typeof includes === 'string' && includes.trim() !== "") {
        const parsed = JSON.parse(includes)
        parsedIncludes = parsed.filter(item => item.icon && item.text && item.icon.trim() !== "" && item.text.trim() !== "")
      } else {
        // Handle FormData: includes[0][icon], includes[0][text]
        const map = {}
        Object.keys(req.body).forEach((key) => {
          const match = key.match(/includes\[(\d+)\]\[(icon|text)\]/)
          if (match) {
            const [_, index, type] = match
            if (!map[index]) map[index] = {}
            map[index][type] = req.body[key]
          }
        })
        const formDataIncludes = Object.values(map).filter(item => item.icon && item.text && item.icon.trim() !== "" && item.text.trim() !== "")
        
        if (formDataIncludes.length > 0) {
          parsedIncludes = formDataIncludes
        }
      }
    }
  } catch (err) {
    console.error("Error parsing includes:", err)
    // Keep existing data on parse error
  }

  // Parse prerequisites
  let parsedPrerequisites = course.prerequisites || []
  try {
    if (prerequisites !== undefined) {
      if (Array.isArray(prerequisites)) {
        parsedPrerequisites = prerequisites.filter(prereq => prereq && prereq.trim() !== "")
      } else if (typeof prerequisites === 'string' && prerequisites.trim() !== "") {
        parsedPrerequisites = JSON.parse(prerequisites).filter(prereq => prereq && prereq.trim() !== "")
      } else {
        // Handle FormData: prerequisites[0], prerequisites[1]...
        const formDataPrerequisites = Object.keys(req.body)
          .filter((key) => key.startsWith("prerequisites["))
          .map((key) => req.body[key]?.trim())
          .filter(Boolean)
        
        if (formDataPrerequisites.length > 0) {
          parsedPrerequisites = formDataPrerequisites
        }
      }
    }
  } catch (err) {
    console.error("Error parsing prerequisites:", err)
    // Keep existing data on parse error
  }

  // Prepare update data object
  const updateData = {}
  
  // Simple string fields
  if (title !== undefined && title.trim() !== "") updateData.title = title
  if (description !== undefined && description.trim() !== "") updateData.description = description
  if (duration !== undefined) updateData.duration = duration || ""
  if (category !== undefined && category.trim() !== "") updateData.category = category
  if (level !== undefined && level.trim() !== "") updateData.level = level
  if (instructorName !== undefined && instructorName.trim() !== "") updateData.instructorName = instructorName

  // Handle instructorBio - can be empty string
  if (instructorBio !== undefined) {
    updateData.instructorBio = instructorBio === "undefined" ? "" : (instructorBio || "")
  }

  // Handle numeric fields with proper validation
  if (price !== undefined && price !== "") {
    const numPrice = parseFloat(price)
    if (!isNaN(numPrice) && numPrice >= 0) {
      updateData.price = numPrice
    }
  }

  if (discountedPrice !== undefined) {
    if (discountedPrice === "" || discountedPrice === null || discountedPrice === "null") {
      updateData.discountedPrice = null
    } else {
      const numDiscount = parseFloat(discountedPrice)
      if (!isNaN(numDiscount) && numDiscount >= 0) {
        updateData.discountedPrice = numDiscount
      }
    }
  }

  if (instructorRating !== undefined && instructorRating !== "") {
    const numRating = parseFloat(instructorRating)
    if (!isNaN(numRating) && numRating >= 0 && numRating <= 5) {
      updateData.instructorRating = numRating
    }
  }

  if (minAge !== undefined) {
    if (minAge === "" || minAge === null || minAge === "null") {
      updateData.minAge = null
    } else {
      const numAge = parseInt(minAge)
      if (!isNaN(numAge) && numAge >= 0) {
        updateData.minAge = numAge
      }
    }
  }

  // Handle media URLs
  if (imageUrl !== course.imageUrl) updateData.imageUrl = imageUrl
  if (instructorImageUrl !== course.instructorImage) updateData.instructorImage = instructorImageUrl
  if (videoUrl !== course.videoUrl) updateData.videoUrl = videoUrl
  
  // Always update array fields (they're already processed)
  updateData.whatYouWillLearn = parsedLearnPoints
  updateData.includes = parsedIncludes
  updateData.prerequisites = parsedPrerequisites

  console.log("📊 Final update data:", updateData) // Debug log

  try {
    await course.update(updateData)
    
    // Fetch the updated course to return fresh data
    const updatedCourse = await Course.findByPk(req.params.id)
    console.log("✅ Course updated successfully:", updatedCourse.id)
    res.json(updatedCourse)
  } catch (error) {
    console.error("❌ Update error:", error)
    return next(new AppError(`Failed to update course: ${error.message}`, 500))
  }
})

export const updateCourseOrder = tryCatch(async (req, res, next) => {
  const { courses } = req.body;

  if (!Array.isArray(courses)) {
    return res.status(400).json({
      success: false,
      message: "Courses array is required",
    });
  }
  if (courses.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Courses array cannot be empty",
    });
  }

  // Normalize, validate, and dedupe IDs
  const courseIdsRaw = courses.map((id) => {
    const n = Number(id);
    if (isNaN(n)) throw new AppError(`Invalid course ID: ${id}`, 400);
    return n;
  });
  const courseIds = Array.from(new Set(courseIdsRaw)); // remove duplicates

  if (courseIds.length !== courseIdsRaw.length) {
    console.warn("Duplicate course IDs in payload were removed:", courseIdsRaw);
  }

  console.log("Requested new order:", courseIds);

  // Verify existence
  const existingCourses = await Course.findAll({
    where: { id: courseIds },
    attributes: ["id", "orderIndex"],
    raw: true,
  });

  if (existingCourses.length !== courseIds.length) {
    const missing = courseIds.filter(
      (id) => !existingCourses.some((c) => c.id === id)
    );
    return res.status(404).json({
      success: false,
      message: `Courses not found: ${missing.join(", ")}`,
    });
  }

  console.log("Before update orderIndexes:", existingCourses);

  // Build and execute CASE update in a transaction
  await Course.sequelize.transaction(async (t) => {
    const cases = courseIds
      .map((id, idx) => `WHEN "id" = ${id} THEN ${idx + 1}`)
      .join(" ");

    // Resolve table name (with schema if present)
    const rawTableName = Course.getTableName();
    let fullTableName;
    if (typeof rawTableName === "object" && rawTableName.schema) {
      fullTableName = `"${rawTableName.schema}"."${rawTableName.tableName}"`;
    } else {
      fullTableName = `"${String(rawTableName)}"`;
    }

    // Execute the bulk update
    await Course.sequelize.query(
      `
      UPDATE ${fullTableName}
      SET "orderIndex" = CASE ${cases} END,
          "updatedAt" = :now
      WHERE "id" IN (${courseIds.join(",")})
      `,
      {
        replacements: { now: new Date() },
        transaction: t,
      }
    );
  });

  // Fetch updated courses, ordered by orderIndex
  const updatedCourses = await Course.findAll({
    where: { id: courseIds },
    order: [["orderIndex", "ASC"]],
    include: [/* any relationships you need */],
  });

  console.log(
    "After update orderIndexes:",
    updatedCourses.map((c) => ({
      id: c.id,
      orderIndex: (c ).orderIndex,
    }))
  );

  return res.json({
    success: true,
    message: "Order updated successfully",
    data: updatedCourses.map((c) => c.get({ plain: true })),
  });
});



export const deleteCourse = tryCatch(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id)
  if (!course) return next(new AppError("Course not found", 404))
  await course.destroy()
  res.json({ message: "Course deleted" })
})
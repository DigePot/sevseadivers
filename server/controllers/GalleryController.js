import { Gallery, User } from "../models/index.js"
import tryCatch from "../utils/tryCatch.js"
import AppError from "../utils/appErorr.js"

export const createGalleryItem = tryCatch(async (req, res, next) => {
  // const baseUrl = `${req.protocol}://${req.get("host")}`
  const baseUrl = `https://${req.get("host")}`
  const { title, description, mediaType } = req.body
  let mediaUrl = req.body.mediaUrl
  if (req.file) {
    mediaUrl = `/upload/${req.file.filename}`
  }
  if (!title || !mediaType) {
    return next(new AppError("Title, and mediaType are required", 400))
  }
  if (!["image", "video"].includes(mediaType)) {
    return next(
      new AppError('Media type must be either "image" or "video"', 400)
    )
  }
  const galleryItem = await Gallery.create({
    title,
    description,
    // mediaUrl,
    mediaUrl: req.file ? `${baseUrl}/upload/${req.file.filename}` : undefined, // Full image URL
    mediaType,
    uploadedBy: req.user.id,
  })
  // Include user information in response
  const galleryItemWithUser = await Gallery.findByPk(galleryItem.id, {
    include: [
      {
        model: User,
        as: "uploader",
        attributes: ["id", "username", "fullName"],
      },
    ],
  })
  res.status(201).json(galleryItemWithUser)
})

export const getAllGalleryItems = tryCatch(async (req, res) => {
  const galleryItems = await Gallery.findAll({
    where: { isActive: true },
    include: [
      {
        model: User,
        as: "uploader",
        attributes: ["id", "username", "fullName"],
      },
    ],
    order: [["createdAt", "DESC"]],
  })

  res.json(galleryItems)
})

export const getGalleryItemById = tryCatch(async (req, res, next) => {
  const galleryItem = await Gallery.findByPk(req.params.id, {
    include: [
      {
        model: User,
        as: "uploader",
        attributes: ["id", "username", "fullName"],
      },
    ],
  })

  if (!galleryItem) {
    return next(new AppError("Gallery item not found", 404))
  }

  res.json(galleryItem)
})

export const updateGalleryItem = tryCatch(async (req, res, next) => {
  const galleryItem = await Gallery.findByPk(req.params.id)

  if (!galleryItem) {
    return next(new AppError("Gallery item not found", 404))
  }

  const { title, description, mediaUrl, mediaType, isActive } = req.body

  if (mediaType && !["image", "video"].includes(mediaType)) {
    return next(
      new AppError('Media type must be either "image" or "video"', 400)
    )
  }

  await galleryItem.update({
    title,
    description,
    mediaUrl,
    mediaType,
    isActive,
  })

  res.json(galleryItem)
})

export const deleteGalleryItem = tryCatch(async (req, res, next) => {
  const galleryItem = await Gallery.findByPk(req.params.id)

  if (!galleryItem) {
    return next(new AppError("Gallery item not found", 404))
  }

  await galleryItem.destroy()
  res.json({ message: "Gallery item deleted successfully" })
})

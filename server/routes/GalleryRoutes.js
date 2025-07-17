import express from "express"
import {
  createGalleryItem,
  getAllGalleryItems,
  getGalleryItemById,
  updateGalleryItem,
  deleteGalleryItem,
} from "../controllers/GalleryController.js"
import authenticateToken from "../middleware/auth.js"
import isAdminAndStaff from "../middleware/isAdminAndStaff.js"
import upload from "../middleware/upload.js"

const router = express.Router()

// Public routes
router.get("/", getAllGalleryItems)
router.get("/:id", getGalleryItemById)

// Admin/Staff routes
router.post(
  "/",
  authenticateToken,
  isAdminAndStaff,
  upload.single("media"),
  createGalleryItem
)
router.put(
  "/:id",
  authenticateToken,
  isAdminAndStaff,
  upload.single("media"),
  updateGalleryItem
)
router.delete("/:id", authenticateToken, isAdminAndStaff, deleteGalleryItem)

export default router

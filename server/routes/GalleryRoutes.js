import express from 'express';
import {
  createGalleryItem,
  getAllGalleryItems,
  getGalleryItemById,
  updateGalleryItem,
  deleteGalleryItem
} from '../controllers/GalleryController.js';
import authenticateToken from '../middleware/auth.js';
import isAdmin from '../middleware/isAdmin.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAllGalleryItems);
router.get('/:id', getGalleryItemById);

// Admin/Staff routes
router.post('/', authenticateToken, isAdmin, upload.single('media'), createGalleryItem);
router.put('/:id', authenticateToken, isAdmin, upload.single('media'), updateGalleryItem);
router.delete('/:id', authenticateToken, isAdmin, deleteGalleryItem);

export default router; 
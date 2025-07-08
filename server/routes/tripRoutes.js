import express from 'express';
import {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip
} from '../controllers/TripController.js';
import authenticateToken from '../middleware/auth.js';
import isAdmin from '../middleware/isAdmin.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/', authenticateToken, isAdmin, upload.single('media'), createTrip);
router.get('/', getAllTrips);
router.get('/:id', getTripById);
router.put('/:id', authenticateToken, isAdmin, upload.single('media'), updateTrip);
router.delete('/:id', authenticateToken, isAdmin, deleteTrip);

export default router; 
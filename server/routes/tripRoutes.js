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

const router = express.Router();

router.post('/', authenticateToken, isAdmin, createTrip);
router.get('/', getAllTrips);
router.get('/:id', getTripById);
router.put('/:id', authenticateToken, isAdmin, updateTrip);
router.delete('/:id', authenticateToken, isAdmin, deleteTrip);

export default router; 
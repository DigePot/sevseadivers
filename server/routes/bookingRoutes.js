import express from 'express';
import {
  createBooking,
  getAllBookingsForUser,
  getBookingById,
  cancelBooking,
  deleteBooking
} from '../controllers/BookingController.js';

const router = express.Router();

router.post('/', createBooking);
router.get('/user/:userId', getAllBookingsForUser);
router.get('/:id', getBookingById);
router.patch('/:id/cancel', cancelBooking);
router.delete('/:id', deleteBooking);

export default router; 
import express from 'express';
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService
} from '../controllers/ServiceController.js';
import authenticateToken from '../middleware/auth.js';
import isAdmin from '../middleware/isAdmin.js';

const router = express.Router();

router.post('/create', authenticateToken, isAdmin, createService);
router.get('/all', getAllServices);
router.get('/:id', getServiceById);
router.put('/:id', authenticateToken, isAdmin, updateService);
router.delete('/:id', authenticateToken, isAdmin, deleteService);

export default router; 
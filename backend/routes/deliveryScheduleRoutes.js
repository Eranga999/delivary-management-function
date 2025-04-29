import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createDeliverySchedule } from '../controllers/deliveryScheduleController.js';

const router = express.Router();

// @desc    Create a delivery schedule for an order
// @route   POST /api/delivery-schedules
// @access  Private
router.post('/', protect, createDeliverySchedule);

export default router;
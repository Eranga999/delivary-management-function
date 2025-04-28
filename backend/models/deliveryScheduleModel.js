import mongoose from 'mongoose';

const deliveryScheduleSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true, // Ensure one schedule per order
  },
  scheduledDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled',
  },
}, { timestamps: true });

const DeliverySchedule = mongoose.model('DeliverySchedule', deliveryScheduleSchema);
export default DeliverySchedule;
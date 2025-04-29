import mongoose from 'mongoose';

const deliveryScheduleSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['processing', 'ongoing', 'delivered', 'cancelled'],
    default: 'processing',
  },
  scheduledDate: {
    type: Date,
    required: true,
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
}, { timestamps: true });

const DeliverySchedule = mongoose.model('DeliverySchedule', deliveryScheduleSchema);
export default DeliverySchedule;
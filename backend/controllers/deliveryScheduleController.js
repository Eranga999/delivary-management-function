import mongoose from 'mongoose';
import Order from '../models/orderModel.js';
import DeliverySchedule from '../models/deliveryScheduleModel.js';

export const createDeliverySchedule = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findById(orderId).session(session);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== userId.toString()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(401).json({ message: 'Not authorized to schedule delivery for this order' });
    }

    if (order.status !== 'pending') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Order is not in a state to schedule delivery' });
    }

    const existingSchedule = await DeliverySchedule.findOne({ order: orderId }).session(session);
    if (existingSchedule) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Delivery schedule already exists for this order' });
    }

    // Set scheduled delivery date to 3 days from now
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + 3);

    const deliverySchedule = new DeliverySchedule({
      order: orderId,
      scheduledDate,
      status: 'scheduled',
    });

    await deliverySchedule.save({ session });

    // Update order status to 'processing'
    order.status = 'processing';
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: 'Delivery schedule created successfully', deliverySchedule });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error creating delivery schedule:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
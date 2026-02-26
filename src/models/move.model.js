const mongoose = require('mongoose');

const moveSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mover: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mover'
  },
  pickup: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  fare: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed', 'cancelled', 'ongoing'],
    default: 'pending'
  },
  duration: {
    type: Number
  },
  distance: {
    type: Number
  },
  paymentId: {
    type: String
  },
  orderId: {
    type: String
  },
  signature: {
    type: String
  },
  otp: {
    type: String,
    select: false,
    required: true
  }
}, { timestamps: true });

const Move = mongoose.model('Move', moveSchema);
module.exports = Move;
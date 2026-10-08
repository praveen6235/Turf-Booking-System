const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'Booking must belong to a user']
  },
  turfId: {
    type: String,
    required: [true, 'Booking must belong to a turf']
  },
  turfDetails: {
    name: String,
    location: {
      address: String,
      city: String
    },
    images: [String]
  },
  date: {
    type: Date,
    required: [true, 'Booking must have a date']
  },
  startTime: {
    type: String,
    required: [true, 'Booking must have a start time']
  },
  endTime: {
    type: String,
    required: [true, 'Booking must have an end time']
  },
  contactNumber: {
    type: String,
    required: [true, 'Booking must have a contact number']
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
    default: 'Pending'
  },
  totalAmount: {
    type: Number,
    required: [true, 'Booking must have a total amount']
  },
  paymentMethod: {
    type: String,
    enum: ['UPI', 'CARD', 'NETBANKING', 'VENUE', 'RAZORPAY'],
    default: 'UPI'
  },
  transactionId: String,
  paymentDetails: {
    upiVpa: String,
    cardLast4: String,
    bankName: String,
    paidAt: Date
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
}, { timestamps: true });

// Prevent double booking on DB level (Unique compound index)
bookingSchema.index(
  { turfId: 1, date: 1, startTime: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: 'Confirmed' } }
);

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;

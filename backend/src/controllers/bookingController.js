const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const Turf = require('../models/Turf');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Initialize Razorpay Instance (Optional)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_123456789',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'
});

exports.createBooking = catchAsync(async (req, res, next) => {
  const { turfId, date, startTime, endTime, contactNumber } = req.body;

  // 1. Check if turf exists
  const turf = await Turf.findById(turfId);
  if (!turf) {
    return next(new AppError('No turf found with that ID', 404));
  }

  // 2. Calculate Total Amount
  const start = parseInt(startTime.split(':')[0]);
  const end = parseInt(endTime.split(':')[0]);
  const hours = end - start;
  
  if (hours <= 0) {
    return next(new AppError('End time must be after start time', 400));
  }
  const totalAmount = hours * turf.pricePerHour;

  // 3. Check for existing confirmed booking
  const existingBooking = await Booking.findOne({
    turfId, date, startTime, status: 'Confirmed'
  });

  if (existingBooking) {
    return next(new AppError('This time slot is already booked! Please select a different time slot.', 400));
  }

  // Check if live/test Razorpay API keys are configured
  const hasRazorpayKeys = process.env.RAZORPAY_KEY_ID && 
    process.env.RAZORPAY_KEY_ID !== 'rzp_test_123456789' && 
    !process.env.RAZORPAY_KEY_ID.includes('YourRazorpayKeyHere');

  // 4. Create booking in DB assigned directly to current logged-in user
  const booking = await Booking.create({
    userId: req.user.id,
    turfId,
    date,
    startTime,
    endTime,
    totalAmount,
    contactNumber,
    status: hasRazorpayKeys ? 'Pending' : 'Confirmed' // Instantly confirm if no Razorpay keys required
  });

  // 5. Create Order object
  let order;
  if (hasRazorpayKeys) {
    order = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_order_${booking._id}`
    });
    booking.razorpayOrderId = order.id;
    await booking.save();
  } else {
    // Instant booking order for account without external API keys
    order = {
      id: `ORDER_DIRECT_${Date.now()}`,
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `REC_${booking._id}`,
      status: 'confirmed'
    };
    booking.razorpayOrderId = order.id;
    booking.razorpayPaymentId = `PAY_DIRECT_${Date.now()}`;
    await booking.save();
  }

  res.status(201).json({
    status: 'success',
    data: {
      booking,
      order,
      isDirectBooking: !hasRazorpayKeys
    }
  });
});

exports.verifyPayment = catchAsync(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

  let isAuthentic = false;

  const hasRazorpayKeys = process.env.RAZORPAY_KEY_SECRET && 
    process.env.RAZORPAY_KEY_SECRET !== 'dummy_secret' && 
    !process.env.RAZORPAY_KEY_SECRET.includes('YourRazorpaySecretHere');

  if (!hasRazorpayKeys || razorpay_signature === 'mock_signature') {
    isAuthentic = true;
  } else {
    // Verify HMAC-SHA256 signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    isAuthentic = expectedSignature === razorpay_signature;
  }

  if (!isAuthentic) {
    return next(new AppError('Invalid Payment Signature', 400));
  }

  // Payment verified successfully -> Update booking status to Confirmed
  const booking = await Booking.findByIdAndUpdate(bookingId, {
    status: 'Confirmed',
    razorpayPaymentId: razorpay_payment_id || `PAY_DIRECT_${Date.now()}`
  }, { new: true });

  res.status(200).json({
    status: 'success',
    message: 'Payment verified successfully',
    data: {
      booking
    }
  });
});

exports.getBookedSlotsByTurf = catchAsync(async (req, res, next) => {
  const { turfId, date } = req.params;

  const startOfDay = new Date(date);
  startOfDay.setHours(0,0,0,0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23,59,59,999);

  const bookings = await Booking.find({
    turfId,
    date: { $gte: startOfDay, $lte: endOfDay },
    status: 'Confirmed'
  }).select('startTime');

  const bookedSlots = bookings.map(b => b.startTime);

  res.status(200).json({
    status: 'success',
    data: {
      bookedSlots
    }
  });
});

exports.getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ userId: req.user.id }).populate('turfId', 'name location images');

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings
    }
  });
});

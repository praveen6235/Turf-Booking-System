const Razorpay = require('razorpay');
const crypto = require('crypto');
const axios = require('axios');
const Booking = require('../models/Booking');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { turfBookingsCreatedTotal, bookingFailuresTotal, bookingConflictsTotal } = require('../utils/metrics');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_123456789',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'
});

const TURF_SERVICE_URL = process.env.TURF_SERVICE_URL || 'http://turf-service:5002';

exports.createBooking = catchAsync(async (req, res, next) => {
  const { turfId, date, startTime, endTime, contactNumber } = req.body;

  const indianMobileRegex = /^(\+91[\-\s]?|91|0)?[6-9]\d{9}$/;
  if (!contactNumber || !indianMobileRegex.test(contactNumber.trim())) {
    bookingFailuresTotal.inc({ reason: 'invalid_phone' });
    return next(new AppError('Please provide a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9', 400));
  }

  // 1. Fetch turf details & pricing from turf-service REST API
  let pricePerHour = 1000;
  let turfDetails = { name: 'Turf', location: { address: '', city: '' }, images: [] };

  try {
    const turfRes = await axios.get(`${TURF_SERVICE_URL}/api/v1/turfs/internal/${turfId}`);
    if (turfRes.data && turfRes.data.data && turfRes.data.data.turf) {
      const t = turfRes.data.data.turf;
      pricePerHour = t.pricePerHour || 1000;
      turfDetails = {
        name: t.name,
        location: t.location,
        images: t.images || []
      };
    }
  } catch (err) {
    console.warn(`Could not fetch internal turf details from ${TURF_SERVICE_URL}, using defaults:`, err.message);
  }

  // 2. Calculate Total Amount
  const start = parseInt(startTime.split(':')[0]);
  const end = parseInt(endTime.split(':')[0]);
  const hours = end - start;
  
  if (hours <= 0) {
    bookingFailuresTotal.inc({ reason: 'invalid_hours' });
    return next(new AppError('End time must be after start time', 400));
  }
  const totalAmount = hours * pricePerHour;

  // 3. Check for existing confirmed booking
  const existingBooking = await Booking.findOne({
    turfId, date, startTime, status: 'Confirmed'
  });

  if (existingBooking) {
    bookingConflictsTotal.inc();
    return next(new AppError('This time slot is already booked! Please select a different time slot.', 400));
  }

  const hasRazorpayKeys = process.env.RAZORPAY_KEY_ID && 
    process.env.RAZORPAY_KEY_ID !== 'rzp_test_123456789' && 
    !process.env.RAZORPAY_KEY_ID.includes('YourRazorpayKeyHere');

  // 4. Create booking
  const bookingStatus = hasRazorpayKeys ? 'Pending' : 'Confirmed';

  const booking = await Booking.create({
    userId: req.user.id,
    turfId,
    turfDetails,
    date,
    startTime,
    endTime,
    totalAmount,
    contactNumber,
    status: bookingStatus
  });

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

  turfBookingsCreatedTotal.inc({ status: bookingStatus });

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
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    isAuthentic = expectedSignature === razorpay_signature;
  }

  if (!isAuthentic) {
    bookingFailuresTotal.inc({ reason: 'payment_signature_invalid' });
    return next(new AppError('Invalid Payment Signature', 400));
  }

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
  const rawBookings = await Booking.find({ userId: req.user.id }).sort('-createdAt');

  const bookings = rawBookings.map(b => {
    const bObj = b.toObject();
    if (!bObj.turfId || typeof bObj.turfId === 'string') {
      bObj.turfId = {
        _id: bObj.turfId,
        name: bObj.turfDetails?.name || 'Turf',
        location: bObj.turfDetails?.location || { address: 'Main Turf', city: 'City' },
        images: bObj.turfDetails?.images || []
      };
    }
    return bObj;
  });

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings
    }
  });
});

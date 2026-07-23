const express = require('express');
const bookingController = require('../controllers/bookingController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/turf-slots/:turfId/:date', bookingController.getBookedSlotsByTurf);

router.use(protect); // All other booking routes require authentication

router.post('/create-order', bookingController.createBooking);
router.post('/verify-payment', bookingController.verifyPayment);
router.get('/my-bookings', bookingController.getMyBookings);

module.exports = router;

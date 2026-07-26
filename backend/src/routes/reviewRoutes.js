const express = require('express');
const reviewController = require('../controllers/reviewController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true }); // Important for nested routes like /turfs/:turfId/reviews

// Specific protected routes
router.get('/my-reviews', protect, reviewController.getMyReviews);

// Public / Turf-nested routes
router.get('/', reviewController.getAllReviews);

// Protected routes
router.use(protect);
router.post('/', restrictTo('Customer'), reviewController.createReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;

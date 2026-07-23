const express = require('express');
const reviewController = require('../controllers/reviewController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true }); // Important for nested routes like /turfs/:turfId/reviews

router.get('/', reviewController.getAllReviews);

router.use(protect); // Protect all routes after this
router.post('/', restrictTo('Customer'), reviewController.createReview);

module.exports = router;

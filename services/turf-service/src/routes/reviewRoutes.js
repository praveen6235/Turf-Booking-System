const express = require('express');
const reviewController = require('../controllers/reviewController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true });

router.get('/my-reviews', protect, reviewController.getMyReviews);
router.get('/', reviewController.getAllReviews);

router.use(protect);
router.post('/', restrictTo('Customer'), reviewController.createReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;

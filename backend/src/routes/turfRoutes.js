const express = require('express');
const turfController = require('../controllers/turfController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// Nested routes
router.use('/:turfId/reviews', reviewRouter);

// Public routes
router.get('/', turfController.getAllTurfs);
router.get('/:id', turfController.getTurf);

// Protected routes (Only Owners and Admins)
router.use(protect);
router.use(restrictTo('Owner', 'Admin'));

router.post('/', turfController.createTurf);
router.patch('/:id', turfController.updateTurf);
router.delete('/:id', turfController.deleteTurf);

module.exports = router;

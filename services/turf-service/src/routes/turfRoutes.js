const express = require('express');
const turfController = require('../controllers/turfController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.use('/:turfId/reviews', reviewRouter);

// Public routes
router.get('/', turfController.getAllTurfs);
router.get('/internal/:id', turfController.getInternalTurf);
router.get('/:id', turfController.getTurf);

// Protected routes (Only Owners and Admins)
router.use(protect);
router.use(restrictTo('Owner', 'Admin'));

router.post('/', uploadMiddleware.uploadTurfImages, turfController.createTurf);
router.patch('/:id', uploadMiddleware.uploadTurfImages, turfController.updateTurf);
router.delete('/:id', turfController.deleteTurf);

module.exports = router;

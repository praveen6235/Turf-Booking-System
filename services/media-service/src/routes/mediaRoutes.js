const express = require('express');
const mediaController = require('../controllers/mediaController');
const { upload } = require('../middlewares/uploadMiddleware');
const { protect } = require('@turf-booking/common');

const router = express.Router();

router.use(protect);
router.post('/upload', upload.array('images', 5), mediaController.uploadImages);
router.delete('/:publicId', mediaController.deleteImage);

module.exports = router;

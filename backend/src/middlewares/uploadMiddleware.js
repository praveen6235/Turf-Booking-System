const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dummy_cloud_name',
  api_key: process.env.CLOUDINARY_API_KEY || 'dummy_api_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'dummy_api_secret'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'turf-booking-system',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 1000, height: 800, crop: 'limit' }] // basic image compression/sizing
  }
});

const upload = multer({ storage: storage });

module.exports = {
  upload,
  cloudinary
};

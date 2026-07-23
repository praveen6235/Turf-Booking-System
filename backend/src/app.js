const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { errorHandler } = require('./middlewares/errorMiddleware');
const AppError = require('./utils/AppError');
const authRouter = require('./routes/authRoutes');
const turfRouter = require('./routes/turfRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

// 1. GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 2. ROUTES
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Turf Booking System API is running smoothly!'
  });
});

app.use('/api/v1/users', authRouter);
app.use('/api/v1/turfs', turfRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/reviews', reviewRouter);

// Handle unhandled routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 3. GLOBAL ERROR HANDLER
app.use(errorHandler);

module.exports = app;

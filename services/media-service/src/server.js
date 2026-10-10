require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5005;

const server = app.listen(PORT, () => {
  console.log(`🚀 media-service running on port ${PORT}`);
});

process.on('unhandledRejection', err => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', err);
  process.exit(1);
});

import app from './app';
import { env } from '@config/env';

const PORT = env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.info(`🚀 Server is running on port ${PORT}`);
  console.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.info(`💚 Health Check: http://localhost:${PORT}/health`);
  console.info(`🌍 Environment: ${env.NODE_ENV}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.info('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.info('HTTP server closed');
  });
});

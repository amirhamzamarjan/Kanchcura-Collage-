require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/database');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Try to connect to MySQL (non-blocking)
    await connectDB();
  } catch (dbErr) {
    console.warn('Database connection warning:', dbErr.message);
  }

  // Start Express server regardless so it serves the app
  try {
    const server = app.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════════════╗
║     KANCHKURA COLLEGE ERP SYSTEM            ║
║     Version   : 1.0.0                        ║
║     Port      : ${String(PORT).padEnd(29)}║
║     Mode      : ${(process.env.NODE_ENV || 'production').padEnd(29)}║
║     Status    : Live & Ready                 ║
╚══════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Server closed.');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received. Shutting down...');
      server.close(() => {
        console.log('Server closed.');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

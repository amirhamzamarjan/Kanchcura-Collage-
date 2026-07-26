require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/database');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MySQL
    await connectDB();

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════════════╗
║     KANCHKURA COLLEGE ERP SYSTEM            ║
║     Version   : 1.0.0                        ║
║     Port      : ${String(PORT).padEnd(33)}║
║     Mode      : ${process.env.NODE_ENV?.padEnd(7) || 'development'.padEnd(7)}                    ║
║     API       : http://localhost:${PORT}/api/v1        ║
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

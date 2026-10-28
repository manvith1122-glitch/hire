import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Server as SocketIOServer } from 'socket.io';
import app from './src/app.js';
import { connectDB, closeDB } from './src/config/db.js';
import { seedDatabase } from './src/utils/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is resolved correctly whether run from root or server/
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config(); // fallback to process.cwd() .env if present

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connect Database (resilient with zero-config embedded fallback)
    await connectDB();

    // 2. Auto-seed demo data if database connection established
    if (mongoose.connection.readyState === 1) {
      await seedDatabase();
    } else {
      console.log('ℹ️ Server running in API mode; waiting for database connection.');
    }

    // 3. Create HTTP & Socket.IO Server
    const server = http.createServer(app);

    // Handle port collision gracefully
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ PORT CONFLICT: Port ${PORT} is already in use by another running process.`);
        console.error(`👉 Solution: Terminate the orphaned process on port ${PORT} or change PORT in server/.env (e.g. PORT=5001).\n`);
        process.exit(1);
      } else {
        console.error('Server runtime error:', err);
        process.exit(1);
      }
    });

    const io = new SocketIOServer(server, {
      cors: {
        origin: [process.env.CLIENT_URL || 'http://localhost:5173', 'http://127.0.0.1:5173'],
        credentials: true
      }
    });

    // Real-time events
    io.on('connection', (socket) => {
      socket.on('join_user_channel', (userId) => {
        if (userId) {
          socket.join(`user_${userId}`);
        }
      });

      socket.on('disconnect', () => {
        // Disconnected
      });
    });

    // Attach io instance to app
    app.set('io', io);

    server.listen(PORT, () => {
      console.log(`\n🚀 ReferHire Backend Server running on port ${PORT}`);
      console.log(`🌐 API Health Check: http://localhost:${PORT}/api/health`);
      console.log(`📡 WebSocket Gateway: ws://localhost:${PORT}`);
      console.log(`🗄️ Database Status: ${mongoose.connection.readyState === 1 ? 'Connected (Ready)' : 'Not Connected'}\n`);
    });

    // Handle graceful shutdown
    const handleShutdown = async () => {
      console.log('\nShutting down gracefully...');
      await closeDB();
      process.exit(0);
    };

    process.on('SIGINT', handleShutdown);
    process.on('SIGTERM', handleShutdown);

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';
import { parse } from 'url';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

interface RoomState {
  mode: 'countdown' | 'countup' | 'clock';
  duration: number; // For progress bar
  remaining: number; // Current time in seconds
  isRunning: boolean;
  message: string;
  messageColor: string;
  flash: boolean;
  invertColors: boolean;
  signalColors: {
    speedUp: string;
    wrapUp: string;
    timesUp: string;
  };
}

const rooms = new Map<string, RoomState>();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-room', (roomId: string) => {
      socket.join(roomId);
      if (!rooms.has(roomId)) {
        rooms.set(roomId, {
          mode: 'countdown',
          duration: 300, // 5 minutes default
          remaining: 300,
          isRunning: false,
          message: '',
          messageColor: '#ffffff',
          flash: false,
          invertColors: false,
          signalColors: {
            speedUp: '#fbbf24', // amber-400
            wrapUp: '#f97316', // orange-500
            timesUp: '#ef4444', // red-500
          },
        });
      }
      socket.emit('sync', rooms.get(roomId));
    });

    socket.on('update-state', (roomId: string, newState: Partial<RoomState>) => {
      if (rooms.has(roomId)) {
        const state = rooms.get(roomId)!;
        const updatedState = { ...state, ...newState };
        rooms.set(roomId, updatedState);
        io.to(roomId).emit('sync', updatedState);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  // Server-side timer tick
  setInterval(() => {
    rooms.forEach((state, roomId) => {
      if (state.isRunning && state.mode !== 'clock') {
        let changed = false;
        if (state.mode === 'countdown' && state.remaining > 0) {
          state.remaining -= 1;
          changed = true;
        } else if (state.mode === 'countup') {
          state.remaining += 1;
          changed = true;
        }

        if (changed) {
          io.to(roomId).emit('tick', state.remaining);
        }
      }
    });
  }, 1000);

  server.all(/.*/, (req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});

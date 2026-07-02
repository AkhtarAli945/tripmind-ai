// // import 'dotenv/config';
// // import express from 'express';
// // import { createServer } from 'http';
// // import cors from 'cors';
// // import helmet from 'helmet';
// // import morgan from 'morgan';
// // import rateLimit from 'express-rate-limit';
// // import passport from 'passport';

// // import connectDB from './config/database.js';
// // import { configurePassport } from './config/passport.js';
// // import { initSocket } from './sockets/index.js';
// // import { errorHandler } from './utils/errors.js';
// // import logger from './utils/logger.js';

// // import authRoutes from './routes/auth.js';
// // import tripRoutes from './routes/trips.js';
// // import chatRoutes from './routes/chat.js';

// // const app = express();
// // const httpServer = createServer(app);

// // // Middleware
// // app.use(helmet());
// // app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
// // app.use(express.json({ limit: '10mb' }));
// // app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// // // Rate limiting
// // app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many requests' }));
// // app.use('/api/chat', rateLimit({ windowMs: 60 * 1000, max: 10, message: 'Chat rate limit exceeded' }));

// // // Passport
// // configurePassport();
// // app.use(passport.initialize());

// // // Socket.io
// // const io = initSocket(httpServer);
// // app.set('io', io);

// // // Routes
// // app.use('/api/auth', authRoutes);
// // app.use('/api/trips', tripRoutes);
// // app.use('/api/chat', chatRoutes);

// // app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// // // Error handler
// // app.use(errorHandler);

// // const PORT = process.env.PORT || 5000;

// // connectDB().then(() => {
// //   httpServer.listen(PORT, () => {
// //     logger.info(`Server running on port ${PORT}`);
// //   });
// // });

// // export default app;





// import 'dotenv/config';
// import express from 'express';
// import { createServer } from 'http';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import rateLimit from 'express-rate-limit';
// import passport from 'passport';

// import connectDB from './config/database.js';
// import { configurePassport } from './config/passport.js';
// import { initSocket } from './sockets/index.js';
// import { errorHandler } from './utils/errors.js';
// import logger from './utils/logger.js';

// import authRoutes from './routes/auth.js';
// import tripRoutes from './routes/trips.js';
// import chatRoutes from './routes/chat.js';

// const app = express();
// const httpServer = createServer(app);

// // Middleware
// app.use(helmet());
// app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
// app.use(express.json({ limit: '10mb' }));
// app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// // Rate limiting
// app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many requests' }));
// app.use('/api/chat', rateLimit({ windowMs: 60 * 1000, max: 10, message: 'Chat rate limit exceeded' }));

// // Passport
// configurePassport();
// app.use(passport.initialize());

// // Socket.io
// const io = initSocket(httpServer);
// app.set('io', io);

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/trips', tripRoutes);
// app.use('/api/chat', chatRoutes);

// app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// // Error handler
// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;

// connectDB().then(() => {
//   httpServer.listen(PORT, () => {
//     logger.info(`Server running on port ${PORT}`);
//   });
// });

// export default app;


import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import passport from 'passport';

import connectDB from './config/database.js';
import { configurePassport } from './config/passport.js';
import { initSocket } from './sockets/index.js';
import { errorHandler } from './utils/errors.js';
import logger from './utils/logger.js';

import authRoutes from './routes/auth.js';
import tripRoutes from './routes/trips.js';
import chatRoutes from './routes/chat.js';

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

app.use(morgan('combined', {
  stream: {
    write: msg => logger.info(msg.trim())
  }
}));

// Rate limiting
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));

// Passport
configurePassport();
app.use(passport.initialize());

// Socket.io
const io = initSocket(httpServer);
app.set('io', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/chat', chatRoutes);

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date()
  });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();

    httpServer.listen(PORT, '0.0.0.0', () => {
      logger.info(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();

export default app;
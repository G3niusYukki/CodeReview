import dotenv from 'dotenv';
dotenv.config();

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import sequelize from './config/database';

import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import reviewRoutes from './routes/review';
import githubRoutes from './routes/github';
import paymentRoutes from './routes/payment';
import teamRoutes from './routes/team';
import webhookRoutes from './routes/webhook';
import { authLimiter, apiLimiter } from './middleware/rateLimiter';

const app: Application = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(morgan('combined'));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/user', apiLimiter, userRoutes);
app.use('/api/review', apiLimiter, reviewRoutes);
app.use('/api/github', apiLimiter, githubRoutes);
app.use('/api/payment', apiLimiter, paymentRoutes);
app.use('/api/team', apiLimiter, teamRoutes);
app.use('/api/webhooks', apiLimiter, webhookRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3001;

async function startServer(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database synchronized');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;

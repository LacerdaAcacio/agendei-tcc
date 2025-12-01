import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import { env } from '@config/env';
import { swaggerOptions } from '@config/swagger';
import { errorHandler } from '@shared/middlewares/errorHandler';

// Routes
import healthRoutes from '@modules/health/health.routes';
import usersRoutes from '@modules/users/users.routes';
import authRoutes from '@modules/auth/auth.routes';
import servicesRoutes from '@modules/services/services.routes';
import bookingsRoutes from '@modules/bookings/bookings.routes';
import homeRoutes from '@modules/home/home.routes';
import reportsRoutes from '@modules/reports/reports.routes';
import categoriesRoutes from '@modules/categories/categories.routes';

const app: Application = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
];

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins, // Permite EXPLICITAMENTE o seu frontend Vite
    credentials: true, // Permite cookies/tokens se precisar no futuro
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Swagger documentation
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use('/health', healthRoutes);
app.use(`/api/${env.API_VERSION}/auth`, authRoutes);
app.use(`/api/${env.API_VERSION}/users`, usersRoutes);
app.use(`/api/${env.API_VERSION}/services`, servicesRoutes);
app.use(`/api/${env.API_VERSION}/bookings`, bookingsRoutes);
app.use(`/api/${env.API_VERSION}/home`, homeRoutes);
app.use(`/api/${env.API_VERSION}/reports`, reportsRoutes);
app.use(`/api/${env.API_VERSION}/categories`, categoriesRoutes);

// Global error handler (must be last)
app.use(errorHandler);

export default app;

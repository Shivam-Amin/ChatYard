import express from 'express';
import { errorMiddleware } from './middleware/err.js';
import userRoute from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

export const app = express();

// Using Middlewares..
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow specific HTTP methods
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers
});

// Using routes..
app.get('/', (req, res) => {
  res.send('Hello from backend...');
});

app.use('/api/v1/user', userRoute);


// Using next() Middleware
app.use(errorMiddleware)

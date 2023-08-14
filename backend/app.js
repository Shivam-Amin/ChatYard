import express from 'express';
import { errorMiddleware } from './middleware/err.js';
import userRoute from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

export const app = express();

// Using Middlewares..
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}))
app.use(cookieParser());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // Allow requests from any origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow specific HTTP methods
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specific headers
  res.header('Access-Control-Allow-Credentials', 'true')
  next();
});

// Using routes..
app.get('/', (req, res) => {
  res.send('Hello from backend...');
});

app.use('/api/v1/user', userRoute);


// Using next() Middleware
app.use(errorMiddleware)

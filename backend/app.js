import express from 'express';
import { errorMiddleware } from './middleware/err.js';
import userRoute from './routes/userRoutes.js';
import chatRoute from './routes/chatRoutes.js';
import messageRoute from './routes/messageRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';

export const app = express();
config({
  path: '.env'
})

// Using Middlewares..
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}))
app.use(cookieParser());

// app.options('*', cors()); // Respond to all OPTIONS requests with CORS headers
console.log(process.env.FRONTEND_URL);
app.use(cors({
  origin: [process.env.FRONTEND_URL],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))



// Using routes..
app.get('/', (req, res) => {
  res.send('Hello from backend...');
});

app.use('/api/v1/user', userRoute);
app.use('/api/v1/chat', chatRoute);
app.use('/api/v1/message', messageRoute);


// Using next() Middleware
app.use(errorMiddleware)

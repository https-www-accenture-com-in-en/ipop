import express from 'express';
import cors from 'cors';
import userRouter from './routes/user.route.js';
import adminRouter from './routes/admin.route.js';

const app = express();
const PORT = 8000;
app.use(cors( { origin: '*' })); // Allow all origins for CORS, you can specify your frontend URL here
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded


// app.use('/api/groups', adminRouter);
app.use('/api', userRouter);
app.use('/api/admin', adminRouter); 

export default app // Export the app for use in other files (e.g., server.js)
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

// Routes middleware
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// test route 
app.get('/', (req,res)=>{
    res.json({
        message: 'Auth API is running...'
    });
});

// start listening
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})
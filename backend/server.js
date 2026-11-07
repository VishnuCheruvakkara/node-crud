import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware 
app.listen(cors());
app.use(express.json());

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
import express from 'express';
import {getUserProfile, updateUserProfile, getAllUsers,deleteUser, updateUser } from '../controllers/userController.js';
import { protect,adminOnly } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

//user routes
router.get('/profile', protect, getUserProfile);
router.patch('/profile', protect, upload.single('image'), updateUserProfile);

//admin routes
router.get('/', protect, adminOnly, getAllUsers);
router.patch('/:id', protect, adminOnly, upload.single('image'), updateUser);
router.delete('/:id', protect, adminOnly, deleteUser);

export default router;
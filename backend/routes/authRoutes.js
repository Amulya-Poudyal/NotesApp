import express from 'express';
import { register, login, refreshAccessToken } from '../controllers/authController.js';

const router = express.Router();

// Public routes (No 'protect' middleware needed here)
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshAccessToken);

export default router;
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        const error = new Error('Not authorized, no token');
        error.status = 401;
        throw error;
    }

    const accessSecret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
    if (!accessSecret) {
        const error = new Error('Server misconfiguration: access token secret is missing');
        error.status = 500;
        throw error;
    }

    try {
        const decoded = jwt.verify(token, accessSecret);
        req.user = decoded;
        next();
    } catch (err) {
        const error = new Error(err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token');
        error.status = 401;
        throw error;
    }
});

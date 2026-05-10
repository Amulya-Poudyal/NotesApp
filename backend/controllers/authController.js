import { db } from '../db/index.js';
import { users } from '../db/schema/users.js';
import { eq, sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { registerSchema, loginSchema } from '../validators/authValidator.js';

const getFirstRow = (queryResult) => {
    if (!queryResult) return undefined;
    if (Array.isArray(queryResult)) {
        // mysql2/raw can return [rows, fields]
        if (Array.isArray(queryResult[0])) return queryResult[0][0];
        return queryResult[0];
    }
    return queryResult;
};

const getAccessSecret = () => process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
const getRefreshSecret = () => process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;

const signAccessToken = (userId) =>
    jwt.sign({ id: userId }, getAccessSecret(), { expiresIn: '15m' });

const signRefreshToken = (userId) =>
    jwt.sign({ id: userId }, getRefreshSecret(), { expiresIn: '7d' });

// REGISTER USER
export const register = asyncHandler(async (req, res) => {
    // 1. Validate input
    const validatedData = registerSchema.parse(req.body);
    const { username, password } = validatedData;

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Save to MySQL
    const fallbackEmail = `${username}@kritim.notes`;
    const result = await db.insert(users).values({
        fullname: username,
        email: fallbackEmail,
        password: hashedPassword,
    });

    res.status(201).json({ id: result[0].insertId, message: "User registered successfully!" });
});

// LOGIN USER
export const login = asyncHandler(async (req, res) => {
    // 1. Validate input
    const { username, password } = loginSchema.parse(req.body);

    if (!getAccessSecret() || !getRefreshSecret()) {
        const error = new Error("Server misconfiguration: token secret is missing");
        error.status = 500;
        throw error;
    }

    // 2. Find user
    const [user] = await db.select().from(users).where(eq(users.fullname, username));

    const hashedPassword = user?.password;
    const responseUsername = user?.fullname || username;

    // 3. Verify password
    if (user && hashedPassword && (await bcrypt.compare(password, hashedPassword))) {
        const accessToken = signAccessToken(user.id);
        const refreshToken = signRefreshToken(user.id);
        
        res.status(200).json({ 
            message: "Login successful",
            username: responseUsername,
            accessToken,
            refreshToken
        });
    } else {
        const error = new Error("Invalid username or password");
        error.status = 401;
        throw error;
    }
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body || {};

    if (!refreshToken) {
        const error = new Error("Refresh token is required");
        error.status = 401;
        throw error;
    }

    if (!getRefreshSecret() || !getAccessSecret()) {
        const error = new Error("Server misconfiguration: token secret is missing");
        error.status = 500;
        throw error;
    }

    const decoded = jwt.verify(refreshToken, getRefreshSecret());
    const accessToken = signAccessToken(decoded.id);

    res.status(200).json({ accessToken });
});
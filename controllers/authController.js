import { db } from '../db/index.js';
import { users } from '../db/schema/users.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { registerSchema, loginSchema } from '../validators/authValidator.js';

// REGISTER USER
export const register = asyncHandler(async (req, res) => {
    // 1. Validate input
    const validatedData = registerSchema.parse(req.body);
    const { username, password } = validatedData;

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Save to MySQL
    await db.insert(users).values({
        username,
        password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully!" });
});

// LOGIN USER
export const login = asyncHandler(async (req, res) => {
    // 1. Validate input
    const { username, password } = loginSchema.parse(req.body);

    // 2. Find user
    const [user] = await db.select().from(users).where(eq(users.username, username));

    // 3. Verify password
    if (user && (await bcrypt.compare(password, user.password))) {
        // 4. Generate JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        
        res.status(200).json({ 
            message: "Login successful",
            token 
        });
    } else {
        const error = new Error("Invalid username or password");
        error.status = 401;
        throw error;
    }
});
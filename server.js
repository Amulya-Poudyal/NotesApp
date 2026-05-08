import 'dotenv/config';
import { db } from './db/index.js';
import { sql } from 'drizzle-orm';
import express from 'express';
import notesRoutes from './routes/notesRoutes.js'
import authRoutes from './routes/authRoutes.js';
import folderRoutes from './routes/folderRoutes.js';
import tagRoutes from './routes/tagRoutes.js'

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use('/api/notes',notesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/tags', tagRoutes);

async function startServer() {
  try {
    console.log("⏳ Connecting to database...");
    await db.execute(sql`SELECT 1`);

    console.log("✅ Database is running and reachable.");
    app.listen(PORT, () => {
      console.log(`🚀 Server started on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Critical Error: Could not connect to the database.");
    console.error(error.message);
    process.exit(1);
  }
}
startServer();
app.use((err, req, res, next) => {
    console.error('❌ Error Stack:', err.stack);

    // If it's a Zod error, format it nicely
    if (err.name === 'ZodError') {
        return res.status(400).json({
            error: 'Validation Error',
            details: err.errors,
        });
    }

    // Default error response
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
    });
});
import 'dotenv/config';
import { db } from './db/index.js';
import { sql } from 'drizzle-orm';
import express from 'express';

const app = express();
const PORT = process.env.PORT;

async function startServer() {
  try {
    // 1. Attempt to communicate with the database
    console.log("⏳ Connecting to database...");
    
    // We run a simple "SELECT 1" to verify the connection is alive
    await db.execute(sql`SELECT 1`);
    
    console.log("✅ Database is running and reachable.");

    // 2. Only start the server if the database check passes
    app.listen(PORT, () => {
      console.log(`🚀 Server started on http://localhost:${PORT}`);
    });

  } catch (error) {
    // 3. If the DB is down, log the error and stop the process
    console.error("❌ Critical Error: Could not connect to the database.");
    console.error(error.message);
    
    // Exit the process with a 'failure' code (1)
    process.exit(1);
  }
}

startServer();
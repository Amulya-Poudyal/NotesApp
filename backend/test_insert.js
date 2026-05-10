import { db } from './db/index.js';
import { sql } from 'drizzle-orm';

async function test() {
  try {
    const username = 'testuser_' + Date.now();
    const fallbackEmail = username + '@example.com';
    const hashedPassword = 'password';
    
    const result = await db.execute(sql`
        INSERT INTO users (fullname, email, passwordhash)
        VALUES (${username}, ${fallbackEmail}, ${hashedPassword})
    `);
    console.log('Result type:', typeof result);
    console.log('Is array:', Array.isArray(result));
    console.log('Result:', result);
    console.log('Result[0].insertId:', result[0]?.insertId);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
test();

import { db } from '../backend/db/index.js';
import { users } from '../backend/db/schema/users.js';
import { sql } from 'drizzle-orm';

async function test() {
  try {
    const result = await db.insert(users).values({
      username: 'testuser_' + Date.now(),
      password: 'password'
    });
    console.log('Result type:', typeof result);
    console.log('Is array:', Array.isArray(result));
    console.log('Result:', result);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
test();

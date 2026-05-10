import { db } from './db/index.js';
import { sql } from 'drizzle-orm';

async function test() {
  try {
    const result = await db.execute(sql`DESCRIBE users`);
    console.log(result[0]);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
test();

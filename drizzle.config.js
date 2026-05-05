import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  // 1. Where your TypeScript schema files are located
  schema: './db/schema/*.js', 
  
  // 2. Where the generated migration files will be saved
  out: './drizzle',             
  
  // 3. The database engine you are using
  dialect: 'mysql',            
  
  // 4. Your connection details (pulling from your .env file)
  dbCredentials: {
    url: process.env.DATABASE_URL, 
  },
});
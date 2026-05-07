import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import 'dotenv/config'

// 1. Import all your separate table files
import * as notesSchema from './schema/notes.js';
import * as usersSchema from './schema/users.js';
import * as foldersSchema from './schema/folders.js';
import * as tagsSchema from './schema/tags.js';

// 2. Import your central relations file
import * as relations from './relations.js';

const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.PASSWORD,
  database: "notesapp",
});

// 3. THE HOOKUP: Spread everything into the schema object
export const db = drizzle(connection, { 
  schema: { 
    ...notesSchema, 
    ...usersSchema, 
    ...foldersSchema, 
    ...tagsSchema, 
    ...relations 
  },mode:"default"
});
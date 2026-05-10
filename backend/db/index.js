import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import "dotenv/config";

import * as notesSchema from "./schema/notes.js";
import * as usersSchema from "./schema/users.js";
import * as foldersSchema from "./schema/folders.js";
import * as tagsSchema from "./schema/tags.js";
import * as relations from "./relations.js";

const pool = mysql.createPool(process.env.DATABASE_URL);

export const db = drizzle(pool, {
  schema: {
    ...notesSchema,
    ...usersSchema,
    ...foldersSchema,
    ...tagsSchema,
    ...relations,
  },
  mode: "default",
});
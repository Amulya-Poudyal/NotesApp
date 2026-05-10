import { mysqlTable, serial, varchar, bigint } from 'drizzle-orm/mysql-core';
import {users} from './users.js';
export const folders = mysqlTable('folders', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  userId: bigint ('user_id', { mode: 'number', unsigned: true }).notNull().references(()=> users.id),
  parentId: bigint('parent_id', { mode: 'number', unsigned: true }).references(() => folders.id, { 
    onDelete: 'cascade' 
  }),
});
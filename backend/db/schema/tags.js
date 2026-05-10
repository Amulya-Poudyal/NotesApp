import { mysqlTable, serial, varchar, bigint, primaryKey } from 'drizzle-orm/mysql-core';
import { users } from './users.js';
import { notes } from './notes.js';


// 1. The Tags Table
export const tags = mysqlTable('tags', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 50 }).notNull(),
    userId: bigint('user_id',{ mode: 'number', unsigned: true }).notNull().references(() => users.id, { onDelete: 'cascade' }),
});

// 2. The Junction Table (Links Notes and Tags)
export const notesToTags = mysqlTable('notes_to_tags', {
    noteId: bigint('note_id',{ mode: 'number', unsigned: true }).notNull().references(() => notes.id, { onDelete: 'cascade' }),
    tagId: bigint('tag_id',{ mode: 'number', unsigned: true }).notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (table) => ({
    // Composite Primary Key: Ensures a note cannot have the same tag twice
    pk: primaryKey({ columns: [table.noteId, table.tagId] }),
}));
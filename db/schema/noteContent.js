import { mysqlTable, varcharm, bigint, serial,json,timestamp } from 'drizzle-orm/mysql-core'
import {notes} from './notes.js';
export const noteContent = mysqlTable('note_content', {
    id: serial('id').primaryKey(),
    noteId: bigint('note_id', { mode: 'number', unsigned: true }).notNull().references(() => notes.id, {
        onDelete: 'cascade'
    }),
    content:json('content'),
    lastSavedAt:timestamp('last_saved_at').defaultNow(),
})
import { mysqlTable, serial, varchar,bigint,primaryKey } from 'drizzle-orm/mysql-core'
export const noteTags = mysqlTable('note_tags', {
    noteId: bigint('note_id', { mode: 'number', unsigned: true }).notNull(),
    tagId: bigint('tag_id', { mode: 'number', unsigned: true }).notNull(),
}, (table) => ({
    // Composite Primary Key prevents duplicate tags on the same note
    pk: primaryKey({ columns: [table.noteId, table.tagId] }),
}));
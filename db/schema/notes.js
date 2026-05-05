import {mysqlTable,serial,varchar,timestamp,boolean,bigint} from 'drizzle-orm/mysql-core';
import {folders} from './folders.js';
import {users} from './users.js';
export const notes=mysqlTable('notes',
    {
        id: serial().primaryKey(),
        title: varchar('title', { length: 255 }).notNull(),
        slug: varchar('slug', { length: 255 }).unique().notNull(),
        folderId: bigint('folder_id', { mode: 'number', unsigned: true }).notNull().references(()=>folders.id,{
        onDelete:'cascade'
        }),
        userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull().references(()=>users.id,{
            onDelete:'cascade'
        }),
        isPinned:boolean('is_pinned').notNull().default(false),
        isArchived:boolean('is_archived').notNull().default(false),
    }
)
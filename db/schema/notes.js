import {mysqlTable,serial,varchar,timestamp,boolean,text,bigint} from 'drizzle-orm/mysql-core';
import {folders} from './folders.js';
import {users} from './users.js';
export const notes=mysqlTable('notes',
    {
        id: serial().primaryKey(),
        title: varchar('title', { length: 255 }).notNull(),
        slug: varchar('slug', { length: 255 }).notNull(),
        content:text('content'),
        folderId: bigint('folder_id', { mode: 'number', unsigned: true }).references(()=>folders.id,{
        onDelete:'cascade'
        }),
        userId: bigint('user_id', { mode: 'number', unsigned: true }).references(()=>users.id,{
            onDelete:'cascade'
        }),
        isPinned:boolean('is_pinned').default(false),
        isArchived:boolean('is_archived').default(false),
        createdAt:timestamp('created_at').defaultNow(),
        updatedAt:timestamp('updated_at').defaultNow().onUpdateNow(),
        deletedAt: timestamp('deleted_at'),

    }
)
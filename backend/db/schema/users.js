import {mysqlTable,serial,varchar,timestamp} from 'drizzle-orm/mysql-core';
export const users= mysqlTable('users',
    {
        id: serial('id').primaryKey(),
        fullname: varchar('fullname', { length: 255 }).notNull(),
        email: varchar('email', { length: 255 }).notNull().unique(),
        password: varchar('passwordhash', { length: 255 }).notNull(),
        createdAt: timestamp('created_at').defaultNow(),
        updatedAt:timestamp('updated_at').defaultNow().onUpdateNow(),
    }
)
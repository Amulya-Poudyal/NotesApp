import {mysqlTable,serial,varchar,email,timestamp} from 'drizzle-orm/mysql-core';
export const users= mysqlTable('users',
    {
        id: serial('id').primaryKey(),
        fullname: varchar('fullname',{length:255}).notNull(),
        email: varchar('email', { length: 255 }).notNull().unique(),
        passwordhash: varchar('passwordhash', { length: 255 }).notNull(),
        created_at: timestamp('created_at').defaultNow(),
        updated_at:timestamp('updated_at').defaultNow(),
    }
)
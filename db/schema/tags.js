import {mysqlTable,serial,varchar,bigint} from 'drizzle-orm/mysql-core'
export const tags = mysqlTable('tags', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull(),
});
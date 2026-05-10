import { relations } from 'drizzle-orm';
import { notes } from './schema/notes.js';
import { folders } from './schema/folders.js';
import { tags } from './schema/tags.js';
import { notesToTags } from './schema/tags.js';

export const notesRelations = relations(notes, ({ one, many }) => ({
  folder: one(folders, {
    fields: [notes.folderId],
    references: [folders.id],
  }),
  noteTags: many(notesToTags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  noteTags: many(notesToTags),
}));

export const noteTagsRelations = relations(notesToTags, ({ one }) => ({
  note: one(notes, {
    fields: [notesToTags.noteId],
    references: [notes.id],
  }),
  tag: one(tags, {
    fields: [notesToTags.tagId],
    references: [tags.id],
  }),
}));
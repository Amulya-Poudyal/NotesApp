import { relations } from 'drizzle-orm';
import { notes } from './schema/notes.js';
import { noteContent } from './schema/noteContent.js';
import { folders } from './schema/folders.js';
import { tags } from './schema/tags.js';
import { noteTags } from './schema/noteTags.js';

export const notesRelations = relations(notes, ({ one, many }) => ({
  content: one(noteContent, {
    fields: [notes.id],
    references: [noteContent.noteId],
  }),
  folder: one(folders, {
    fields: [notes.folderId],
    references: [folders.id],
  }),
  noteTags: many(noteTags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  noteTags: many(noteTags),
}));

export const noteTagsRelations = relations(noteTags, ({ one }) => ({
  note: one(notes, {
    fields: [noteTags.noteId],
    references: [notes.id],
  }),
  tag: one(tags, {
    fields: [noteTags.tagId],
    references: [tags.id],
  }),
}));
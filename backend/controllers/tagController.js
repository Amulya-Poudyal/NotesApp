import { db } from '../db/index.js';
import { tags, notesToTags } from '../db/schema/tags.js';
import { eq, and } from 'drizzle-orm';
import { asyncHandler } from '../utils/asyncHandler.js';

// Create a new tag
export const createTag = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const result = await db.insert(tags).values({ 
        name, 
        userId: req.user.id 
    });
    res.status(201).json({ id: result.insertId, name });
});

// Get all tags for the user
export const getTags = asyncHandler(async (req, res) => {
    const data = await db.select().from(tags).where(eq(tags.userId, req.user.id));
    res.status(200).json(data);
});

// Attach a tag to a note
export const addTagToNote = asyncHandler(async (req, res) => {
    const { noteId, tagId } = req.body;
    await db.insert(notesToTags).values({ noteId, tagId });
    res.status(200).json({ message: "Tag added to note!" });
});

// Remove a tag from a note (Detach)
export const removeTagFromNote = asyncHandler(async (req, res) => {
    const { noteId, tagId } = req.body;
    await db.delete(notesToTags).where(
        and(eq(notesToTags.noteId, noteId), eq(notesToTags.tagId, tagId))
    );
    res.status(200).json({ message: "Tag removed from note" });
});

// Delete a tag globally
export const deleteTag = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await db.delete(tags).where(
        and(eq(tags.id, id), eq(tags.userId, req.user.id))
    );
    res.status(200).json({ message: "Tag deleted successfully" });
});
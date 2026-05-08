import { db } from '../db/index.js';
import { tags, notesToTags } from '../db/schema/tags.js';
import { eq, and } from 'drizzle-orm';
import { asyncHandler } from '../utils/asyncHandler.js';

// Create a new tag
export const createTag = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const [result] = await db.insert(tags).values({ 
        name, 
        userId: req.user.id 
    });
    res.status(201).json({ id: result.insertId, name });
});

// Attach a tag to a note
export const addTagToNote = asyncHandler(async (req, res) => {
    const { noteId, tagId } = req.body;

    // Logic: Insert into the junction table
    await db.insert(notesToTags).values({ noteId, tagId });

    res.status(200).json({ message: "Tag added to note!" });
});
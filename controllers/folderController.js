import { db } from '../db/index.js';
import { folders } from '../db/schema/folders.js';
import { notes } from '../db/schema/notes.js';
import { eq, and } from 'drizzle-orm';
import { asyncHandler } from '../utils/asyncHandler.js';
import { z } from 'zod';

// Validation Schema
const folderSchema = z.object({
    name: z.string().min(1, "Folder name is required").max(100),
});

// CREATE FOLDER
export const createFolder = asyncHandler(async (req, res) => {
    const { name } = folderSchema.parse(req.body);
    const userId = req.user.id;

    const [result] = await db.insert(folders).values({
        name,
        userId
    });

    res.status(201).json({
        id: result.insertId,
        message: "Folder created successfully!"
    });
});

// GET ALL FOLDERS
export const getFolders = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const data = await db.select()
        .from(folders)
        .where(eq(folders.userId, userId));

    res.status(200).json(data);
});

// UPDATE FOLDER (RENAME)
export const updateFolder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = folderSchema.parse(req.body);
    const userId = req.user.id;

    const [result] = await db.update(folders)
        .set({ name })
        .where(and(eq(folders.id, id), eq(folders.userId, userId)));

    if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Folder not found or unauthorized." });
    }

    res.status(200).json({ message: "Folder renamed successfully!" });
});

// DELETE FOLDER
export const deleteFolder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    // Logic: Delete the folder. 
    // Because of 'onDelete: set null' in notes schema, 
    // the notes inside will automatically become "unfiled".
    const [result] = await db.delete(folders)
        .where(and(eq(folders.id, id), eq(folders.userId, userId)));

    if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Folder not found." });
    }

    res.status(200).json({ message: "Folder deleted successfully. Notes are now unfiled." });
});
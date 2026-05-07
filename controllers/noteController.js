import { eq, like, and, or, desc } from 'drizzle-orm';
import { notes } from '../db/schema/notes.js';
import { db } from '../db/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { noteSchema } from '../validators/noteValidator.js'; // Ensure this path is correct
import slugify from 'slugify';

// CREATE NOTE
export const createNote = asyncHandler(async (req, res) => {
    // .parse() will throw an error if validation fails, which asyncHandler catches
    const validatedData = noteSchema.parse(req.body);

    const result = await db.insert(notes).values({
        ...validatedData,
        slug: slugify(validatedData.title, { lower: true }),
        createdAt: new Date(),
    });

    res.status(201).json({ 
        id: result[0].insertId, 
        message: "Note created successfully!!" 
    });
});

// EDIT NOTE
export const editNote = asyncHandler(async (req, res) => {
    const validatedData = noteSchema.partial().parse(req.body);
    const { id } = req.params;

    const [result] = await db.update(notes)
        .set({
            ...validatedData,
            // Only update slug if title is being changed
            ...(validatedData.title && { slug: slugify(validatedData.title, { lower: true }) })
        })
        .where(eq(notes.id, id));

    if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Note not found." });
    }

    res.status(200).json({ message: "Note updated successfully!" });
});

// DELETE NOTE
export const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const [result] = await db.delete(notes).where(eq(notes.id, id));

    if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Note not found." });
    }
    
    res.status(200).json({ message: "Note deleted successfully!" });
});

// GET NOTES (SEARCH & PAGINATION)
export const getNotes = asyncHandler(async (req, res) => {
    const { search, page = 1, limit = 10 } = req.query;
    const filters = [];

    if (search) {
        const pattern = `%${search}%`;
        filters.push(
            or(
                like(notes.title, pattern),
                like(notes.content, pattern)
            )
        );
    }

    const data = await db.select()
        .from(notes)
        .where(and(...filters))
        .orderBy(desc(notes.createdAt)) // Newest first
        .limit(Number(limit))
        .offset((Number(page) - 1) * Number(limit));

    res.status(200).json(data);
});
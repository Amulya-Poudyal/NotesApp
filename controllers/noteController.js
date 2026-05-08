import { eq, like, and, or, desc, isNull, isNotNull } from 'drizzle-orm';
import { notes } from '../db/schema/notes.js';
import { tags, notesToTags } from '../db/schema/tags.js';
import { db } from '../db/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { noteSchema } from '../validators/noteValidator.js';
import slugify from 'slugify';

// CREATE NOTE
export const createNote = asyncHandler(async (req, res) => {
    const validatedData = noteSchema.parse(req.body);
    const userId = req.user.id; // From Auth Middleware

    const [result] = await db.insert(notes).values({
        ...validatedData,
        userId,
        slug: slugify(validatedData.title, { lower: true }),
        createdAt: new Date(),
    });

    res.status(201).json({ 
        id: result.insertId, 
        message: "Note created successfully!!" 
    });
});

// EDIT NOTE
export const editNote = asyncHandler(async (req, res) => {
    const validatedData = noteSchema.partial().parse(req.body);
    const { id } = req.params;
    const userId = req.user.id;

    const [result] = await db.update(notes)
        .set({
            ...validatedData,
            ...(validatedData.title && { slug: slugify(validatedData.title, { lower: true }) })
        })
        .where(and(eq(notes.id, id), eq(notes.userId, userId)));

    if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Note not found or unauthorized." });
    }

    res.status(200).json({ message: "Note updated successfully!" });
});

// MOVE TO TRASH (SOFT DELETE)
export const trashNote = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const [result] = await db.update(notes)
        .set({ deletedAt: new Date() })
        .where(and(eq(notes.id, id), eq(notes.userId, userId)));

    if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Note not found." });
    }

    res.status(200).json({ message: "Note moved to trash bin" });
});

export const getNotes = asyncHandler(async (req, res) => {
    const { search, tagId, page = 1, limit = 10 } = req.query;
    const userId = req.user.id;
    const offset = (Number(page) - 1) * Number(limit);

    // 1. Core Filters: Ownership and Not in Trash
    const filters = [
        eq(notes.userId, userId),
        isNull(notes.deletedAt)
    ];

    // 2. Keyword Search (Title or Content)
    if (search) {
        const pattern = `%${search}%`;
        filters.push(or(like(notes.title, pattern), like(notes.content, pattern)));
    }

    // 3. Category Filter (by Tag)
    if (tagId) {
        filters.push(eq(notesToTags.tagId, Number(tagId)));
    }

    // 4. Execute Main Query
    // We select specific fields and aggregate tags to prevent row duplication
    const data = await db.select({
        id: notes.id,
        title: notes.title,
        content: notes.content,
        slug: notes.slug,
        isPinned: notes.isPinned,
        folderId: notes.folderId,
        createdAt: notes.createdAt,
        tagNames: sql`GROUP_CONCAT(${tags.name})`.as('tagNames'),
        tagIds: sql`GROUP_CONCAT(${tags.id})`.as('tagIds')
    })
    .from(notes)
    .leftJoin(notesToTags, eq(notes.id, notesToTags.noteId))
    .leftJoin(tags, eq(notesToTags.tagId, tags.id))
    .where(and(...filters))
    .groupBy(notes.id) 
    // ORDERING: Pinned first, then newest first
    .orderBy(desc(notes.isPinned), desc(notes.createdAt))
    .limit(Number(limit))
    .offset(offset);

    // 5. Transform Aggregated Strings into clean Object Arrays
    const formattedNotes = data.map(note => ({
        ...note,
        isPinned: !!note.isPinned, // Ensure it's a true boolean
        tags: note.tagNames 
            ? note.tagNames.split(',').map((name, index) => ({
                id: Number(note.tagIds.split(',')[index]),
                name
              }))
            : []
    }));

    // 6. Pagination Metadata
    // Uses distinct count to ensure we count unique notes, not tag rows
    const [countResult] = await db.select({ count: sql`count(distinct ${notes.id})` })
        .from(notes)
        .leftJoin(notesToTags, eq(notes.id, notesToTags.noteId))
        .where(and(...filters));

    const totalNotes = countResult.count;
    const totalPages = Math.ceil(totalNotes / Number(limit));

    res.status(200).json({
        success: true,
        meta: {
            totalNotes,
            totalPages,
            currentPage: Number(page),
            limit: Number(limit),
            hasNextPage: Number(page) < totalPages,
            hasPrevPage: Number(page) > 1
        },
        notes: formattedNotes
    });
});

export const togglePinNote = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    // 1. Find the current status of the note
    const [existingNote] = await db.select({ isPinned: notes.isPinned })
        .from(notes)
        .where(and(eq(notes.id, id), eq(notes.userId, userId)));

    if (!existingNote) {
        return res.status(404).json({ message: "Note not found." });
    }

    // 2. Toggle the boolean
    await db.update(notes)
        .set({ isPinned: !existingNote.isPinned })
        .where(eq(notes.id, id));

    res.status(200).json({ 
        message: existingNote.isPinned ? "Note unpinned" : "Note pinned" 
    });
});

// GET TRASH BIN
export const getTrash = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const data = await db.select()
        .from(notes)
        .where(and(
            eq(notes.userId, userId),
            isNotNull(notes.deletedAt)
        ))
        .orderBy(desc(notes.deletedAt));

    res.status(200).json(data);
});

// PERMANENT DELETE (HARD DELETE)
export const deleteNotePermanently = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const [result] = await db.delete(notes)
        .where(and(eq(notes.id, id), eq(notes.userId, userId)));

    if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Note not found." });
    }

    res.status(200).json({ message: "Note permanently deleted." });
});
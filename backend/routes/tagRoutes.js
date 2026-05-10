import express from 'express';
import { 
    createTag, 
    getTags, 
    addTagToNote, 
    removeTagFromNote,
    deleteTag
} from '../controllers/tagController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Tag Management
router.get('/', getTags);              // Get list of all tags created by user
router.post('/', createTag);           // Create a new tag (e.g., "Urgent")
router.delete('/:id', deleteTag);      // Delete a tag globally

// Note-Tag Association (The Junction Table)
router.post('/attach', addTagToNote);      // POST { noteId, tagId }
router.delete('/detach', removeTagFromNote); // DELETE { noteId, tagId }

export default router;
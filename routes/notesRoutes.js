import express from 'express';
import { 
    getNotes, createNote, editNote, 
    trashNote, getTrash, deleteNotePermanently 
} from '../controllers/noteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // ALL note routes require login

router.get('/', getNotes);                // Get active notes
router.post('/', createNote);             // Create new note
router.patch('/:id', editNote);           // Update note
router.patch('/:id/trash', trashNote);    // Move to trash
router.get('/bin', getTrash);             // View trash bin
router.delete('/:id/permanent', deleteNotePermanently); // Hard delete

export default router;
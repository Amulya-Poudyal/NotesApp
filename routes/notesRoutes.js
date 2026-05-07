import { Router } from 'express';
import { createNote, deleteNote, editNote, getNotes } from '../controllers/noteController.js';
const router = Router();
router.post('/', createNote);
router.patch('/:id', editNote);
router.delete('/:id', deleteNote);
router.get('/', getNotes);
export default router;
import express from 'express';
import { 
    createFolder, 
    getFolders, 
    deleteFolder, 
    updateFolder 
} from '../controllers/folderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All folder actions require a logged-in user
router.use(protect);

router.get('/', getFolders);           // Get all folders for the user
router.post('/', createFolder);        // Create a new folder
router.patch('/:id', updateFolder);    // Rename a folder
router.delete('/:id', deleteFolder);   // Delete folder (notes move to 'unfiled')

export default router;
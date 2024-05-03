import { Router } from 'express';
const router = Router();
import timeEntryController from '../controllers/timeEntryController.mjs';

router.post('/', timeEntryController.createTimeEntry);
router.get('/:user_id', timeEntryController.getTimeEntriesByUserId);
router.put('/:entry_id', timeEntryController.updateTimeEntry);
router.delete('/:id', timeEntryController.deleteTimeEntry);

export default router;
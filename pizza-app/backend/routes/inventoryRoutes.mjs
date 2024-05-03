import express from 'express';
import inventoryController from '../controllers/inventoryController.mjs';

const router = express.Router();

router.post('/', inventoryController.addInventory);
router.delete('/:id', inventoryController.deleteInventory);
router.get('/', inventoryController.getInventory);
router.put('/:id', inventoryController.updateInventory);

export default router;
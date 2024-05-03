import express from 'express';
import invTrackingController from '../controllers/invTrackingController.mjs';

const router = express.Router();

router.post('/', invTrackingController.addTracking);
router.delete('/:id', invTrackingController.deleteTracking);
router.get('/', invTrackingController.getTracking);
router.put('/:id', invTrackingController.updateTracking);

export default router;
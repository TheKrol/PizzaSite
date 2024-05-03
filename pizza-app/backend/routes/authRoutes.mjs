import express from 'express';
import { forgotPassword, resetPassword } from '../controllers/authController.mjs';

const router = express.Router();

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken', resetPassword);

export default router;

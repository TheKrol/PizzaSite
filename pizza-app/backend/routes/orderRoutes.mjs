// routes.js
import express from "express";
import orderController from "../controllers/orderController.mjs";

const router = express.Router();

router.post('/add', orderController.addCart);
router.get('/', orderController.getAllOrders);
router.patch('/:orderId/status', orderController.updateOrderStatus);

export default router;
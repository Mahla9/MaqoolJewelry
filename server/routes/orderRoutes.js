import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createOrder, getUserOrders, getOrderById } from '../controllers/orderController.js';
const router = Router();


router.route('/').post(protect, createOrder);
router.route('/dashboard').get(protect, getUserOrders);
router.route('/:id').get(protect, getOrderById);

export default router;
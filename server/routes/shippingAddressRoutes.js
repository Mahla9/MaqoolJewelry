import { Router } from "express";
import { addShippingAddress, getShippingAddresses, updateShippingAddress, deleteShippingAddress } from '../controllers/shippingAddressController.js';
import { protect } from "../middleware/authMiddleware.js";
const router = Router();

router.route('/').post(protect, addShippingAddress).get(protect, getShippingAddresses);
router.route('/:id')
  .patch(protect, updateShippingAddress)
  .delete(protect, deleteShippingAddress);
export default router;
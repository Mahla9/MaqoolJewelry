import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getWishlist, updateWishlist } from '../controllers/wishlistController.js'

const router = Router();

router.route('/').get(protect, getWishlist).put(protect, updateWishlist);

export default router;
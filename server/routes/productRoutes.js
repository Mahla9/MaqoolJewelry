import { Router } from "express";
import { getAllProducts } from "../controllers/productController.js";

const router = Router();

// گرفتن لیست همه محصولات
router.get("/", getAllProducts);

export default router;
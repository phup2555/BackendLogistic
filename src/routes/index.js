import { Router } from "express";
import productRoutes from "./product.js";
import userRoutes from "./user.js";
import roomRoutes from "./room.js";
import barcodeRoutes from "./barcode.js";
const router = Router();

router.use("/products", productRoutes);
router.use("/users", userRoutes);
router.use("/room", roomRoutes);
router.use("/barcode", barcodeRoutes);
export default router;

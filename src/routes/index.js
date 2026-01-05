import { Router } from "express";
import productRoutes from "./product.js";
import userRoutes from "./user.js";
import roomRoutes from "./room.js";
import barcodeRoutes from "./barcode.js";
import logsRoute from "./logs.js";
const router = Router();

router.use("/products", productRoutes);
router.use("/users", userRoutes);
router.use("/room", roomRoutes);
router.use("/barcode", barcodeRoutes);
router.use("/logs", logsRoute);
export default router;

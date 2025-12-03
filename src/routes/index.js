import { Router } from "express";
import productRoutes from "./product.js";
import userRoutes from "./user.js";
import roomRoutes from "./room.js";
const router = Router();

router.use("/products", productRoutes);
router.use("/users", userRoutes);
router.use("/room", roomRoutes);
export default router;

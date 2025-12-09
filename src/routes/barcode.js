import express from "express";
import { getBarcodes } from "../controllers/barcode.js";
const router = express.Router();

router.get("/:barcode", getBarcodes);

export default router;

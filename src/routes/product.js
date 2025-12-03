import express from "express";
import {
  getProducts,
  createProduct,
  getProductsLocationIn,
} from "../controllers/product.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/Location", getProductsLocationIn);
router.post("/", createProduct);

export default router;

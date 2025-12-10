import express from "express";
import {
  getProducts,
  createProduct,
  getProductsLocationIn,
  editProduct,
  outProduct,
} from "../controllers/product.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/Location", getProductsLocationIn);
router.post("/", createProduct);
router.patch("/:productId", editProduct);
router.patch("/out/:productId", outProduct);
export default router;

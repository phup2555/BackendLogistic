import * as productService from "../services/product.js";

export const getProducts = async (req, res, next) => {
  try {
    const data = await productService.getProducts();
    res.status(200).json({ data: data });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { pd_customer_name, pd_customer_No_box, barcode } = req.body;

    await productService.createProduct({
      pd_customer_name,
      pd_customer_No_box,
      barcode,
    });

    res.status(200).json({ message: "Success Created" });
  } catch (err) {
    next(err);
  }
};
export const getProductsLocationIn = async (req, res, next) => {
  try {
    const data = await productService.getProductsLocation();
    res.status(200).json({ data: data });
  } catch (err) {
    next(err);
  }
};

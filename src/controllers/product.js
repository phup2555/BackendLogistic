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
    const { pd_customer_name, pd_customer_No_box, location_id } = req.body;
    if (!pd_customer_name || !pd_customer_No_box || !location_id) {
      res.status(400).json({
        message:
          "ກະລຸນາປ້ອນຂໍ້ມຸນໃຫ້ຄົບຖ້ວນ pd_customer_name pd_customer_No_box location_id",
      });
    }
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");

    const barcode = `${pd_customer_No_box}${year}${month}${day}${hour}${minute}`;

    const product = await productService.createProduct({
      pd_customer_name,
      pd_customer_No_box,
      barcode,
      location_id,
    });
    res.status(201).json({ message: "ຝາກສຳເລັດ", barcode: product.barcode });
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

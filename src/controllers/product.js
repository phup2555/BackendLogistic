import { AppError } from "../middleware/errorHandler.js";
import * as productService from "../services/product.js";
import * as logsService from "../services/logs.js";
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
    const {
      pd_customer_name,
      pd_customer_No_box,
      location_id,
      Doc,
      Sbox,
      user_id,
    } = req.body;

    if (!pd_customer_name || !pd_customer_No_box || !location_id) {
      return res.status(400).json({
        message:
          "ກະລຸນາປ້ອນຂໍ້ມຸນໃຫ້ຄົບຖ້ວນ pd_customer_name pd_customer_No_box location_id",
      });
    }
    if (!Sbox) {
      return res.status(400).json({
        message: "ຂໍ້ມູນໂຊນSboxບໍ່ຖືກຕ້ອງ",
      });
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");

    const dateYmd = `${year}${month}${day}`;

    const lastRun = await productService.getLastBarcodeRun4(dateYmd);

    const nextRun = lastRun + 1;
    const running = String(nextRun).padStart(4, "0");

    const barcode = `${running}${year}${month}${day}${hour}${minute}`;

    const product = await productService.createProduct({
      pd_customer_name,
      pd_customer_No_box,
      barcode,
      location_id,
      Doc,
      Sbox,
    });
    await logsService.createLog({
      action: "ADD",
      user_id: user_id,
      target_id: pd_customer_No_box,
      note: `ລະຫັດສິນຄ້າ: ${pd_customer_No_box} ,ທີ່: ${location_id}`,
    });

    res.status(201).json({
      message: "ຝາກສຳເລັດ",
      barcode,
    });
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
export const editProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { pd_customer_name, pd_customer_No_box, user_id } = req.body;
    const data = await productService.editProduct(productId, {
      pd_customer_name,
      pd_customer_No_box,
    });
    const beforePd_No_box = await productService.getBeforePd_no_box(productId);
    const beforePd_name = await productService.getBeforePd_name(productId);
    await logsService.createLog({
      action: "Edit product",
      user_id: user_id,
      target_id: pd_customer_No_box,
      note: `productId:${productId};pd_name:${pd_customer_name};pd_no_box:${pd_customer_No_box} || oldPd_no:${beforePd_No_box?.pd_customer_No_box};oldPd_name:${beforePd_name?.pd_customer_name}`,
    });
    res.status(200).json({ data: data });
  } catch (error) {
    console.log("err", error);
    throw new AppError("Server error editProduct Contoller", 500, error);
  }
};
export const outProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { docOut } = req.body;
    const datas = await productService.outProduct(productId, docOut);
    res.status(200).json({ data: datas });
  } catch (error) {
    console.log("err", error);
    throw new AppError("Server error outProduct Contoller", 500, error);
  }
};

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
    const getLastPd_id = await productService.getLastProduct();
    await logsService.createLog({
      action: "ADD",
      user_id: user_id,
      path: req.originalUrl,
      method: req?.method,
      pd_id: getLastPd_id,
      Pd_No_target_id: pd_customer_No_box,
      note: `ລະຫັດສິນຄ້າ: ${pd_customer_No_box} ,ທີ່: ${location_id},ຂາເຂົ້າ: ${Doc}`,
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
    const beforePd_No_box = await productService.getBeforePd_no_box(productId);
    const beforePd_name = await productService.getBeforePd_name(productId);
    if (!productId) {
      throw new AppError("ບໍ່ສາມາດແກ້ໄຂໄດ້ເນື່ອງຈາກບໍ່ມີProductId", 400);
    }
    await logsService.createLog({
      action: "Edit product",
      user_id,
      path: req.originalUrl,
      Pd_No_target_id: pd_customer_No_box,
      method: req?.method,
      pd_id: productId,
      note: `
*NEW
+Pd Name   : ${pd_customer_name}
+Pd No Box : ${pd_customer_No_box}

*OLD
+Pd Name   : ${beforePd_name?.pd_customer_name ?? "-"}
+Pd No Box : ${beforePd_No_box?.pd_customer_No_box ?? "-"}
`.trim(),
    });

    const data = await productService.editProduct(productId, {
      pd_customer_name,
      pd_customer_No_box,
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
    const { docOut, user_id, pd_customer_No_box, pd_customer_name } = req.body;
    const location_id = await productService.getLocationByPd_id(productId);
    const datas = await productService.outProduct(productId, docOut);
    await logsService.createLog({
      action: "Out Stock",
      user_id: user_id,
      path: req.originalUrl,
      method: req?.method,
      pd_id: productId,
      Pd_No_target_id: pd_customer_No_box,
      note: `
ລະຫັດສິນຄ້າ : ${pd_customer_No_box}
ຊື່ສິນຄ້າ   : ${pd_customer_name}
ສະຖານທີ່     : ${location_id[0]?.location_id}
ເອກະສານຂາອອກ : ${docOut}
`.trim(),
    });
    res.json(datas);
  } catch (error) {
    console.log("err", error);
    throw new AppError("Server error outProduct Contoller", 500, error);
  }
};

import { AppError } from "../middleware/errorHandler.js";
import * as Service from "../services/barcode.js";
import bwipjs from "bwip-js";
export const getBarcodes = async (req, res) => {
  try {
    const { barcode } = req.params;

    console.log("Generating barcode:", barcode);

    const png = await bwipjs.toBuffer({
      bcid: "code128",
      text: barcode,
      scale: 3,
      height: 15,
      includetext: true,
      textxalign: "center",
    });

    res.setHeader("Content-Type", "image/png");
    res.send(png);
  } catch (err) {
    console.error("BARCODE ERROR:", err);
    res.status(500).json({
      message: "Generate barcode failed",
      error: err.message,
    });
  }
};

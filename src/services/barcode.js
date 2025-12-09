import { connectDB, sql } from "../config/db.js";
import { AppError } from "../middleware/errorHandler.js";
import bwipjs from "bwip-js";
export async function getBarcode(barcode) {
  try {
    const pool = await connectDB();
    const result = await pool
      .request()
      .input("barcode", sql.NVarChar, barcode)
      .query("SELECT barcode FROM  product WHERE barcode = @barcode");
    return result.recordset;
  } catch (error) {
    throw new AppError("Server error", 500, error);
  }
}

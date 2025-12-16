import { connectDB, sql } from "../config/db.js";
import { AppError } from "../middleware/errorHandler.js";

export async function getProducts() {
  try {
    const pool = await connectDB();
    const result = await pool
      .request()
      .query("SELECT * FROM product order by pd_id desc");
    return result.recordset;
  } catch (error) {
    throw new AppError("Server error", 500, error);
  }
}

export async function getLastBarcodeRun4(dateYmd) {
  const pool = await connectDB();
  const result = await pool.query(`
    SELECT ISNULL(MAX(CAST(LEFT(barcode, 4) AS INT)), 0) AS lastRun
    FROM product
    WHERE barcode LIKE '____${dateYmd}%'
  `);

  return result.recordset[0].lastRun;
}

export async function createProduct(data) {
  try {
    const pool = await connectDB();

    const {
      pd_customer_name,
      pd_customer_No_box,
      barcode,
      location_id,
      Doc,
      Sbox,
    } = data;
    // console.log({ Sbox });
    const result = await pool
      .request()
      .input("name", sql.NVarChar, pd_customer_name)
      .input("box", sql.NVarChar, pd_customer_No_box)
      .input("barcode", sql.NVarChar, barcode)
      .input("pd_Document", sql.NVarChar, Doc)
      .input("location_id", sql.Int, location_id)
      .input("Sbox", sql.VarChar, Sbox).query(`
      INSERT INTO product
      (pd_customer_name, pd_customer_No_box, pd_incoming_date, pd_status, barcode, location_id,pd_Document,pd_sbox)
      OUTPUT INSERTED.*
      VALUES
      (@name, @box, GETDATE(), 'in_storage', @barcode, @location_id,@pd_Document,@Sbox);
    `);

    return result.recordset[0];
  } catch (error) {
    throw new AppError("Server error createProduct", 500);
  }
}

export async function getProductsLocation() {
  try {
    const pool = await connectDB();
    const result = await pool.request().query(
      `
    SELECT DISTINCT 
      locations.location_id, 
      product.barcode, 
      rooms.room_id,
        rooms.name,
        locations.zone,
        locations.row_no,
        locations.slot_no,    
        product.pd_customer_name, 
        product.pd_customer_No_box, 
        product.pd_incoming_date ,
        product.pd_status
    FROM product
    LEFT JOIN locations ON product.location_id = locations.location_id
    LEFT JOIN rooms ON locations.room_id = rooms.room_id
    where pd_status = 'in_storage'
  `
    );
    return result.recordset;
  } catch (error) {
    throw new AppError("Server error getProductsLocation", 500, error);
  }
}
export async function editProduct(productId, data) {
  try {
    const pool = await connectDB();
    const { pd_customer_name, pd_customer_No_box } = data;
    const result = await pool
      .request()
      .input("productId", sql.Int, productId)
      .input("name", sql.NVarChar, pd_customer_name)
      .input("box", sql.NVarChar, pd_customer_No_box).query(`
      UPDATE product
      SET 
        pd_customer_name = @name,
        pd_customer_No_box = @box
      WHERE pd_id = @productId
      ;
    `);
    return {
      success: result.rowsAffected[0] > 0,
      rowsAffected: result.rowsAffected[0],
      message:
        result.rowsAffected[0] > 0
          ? "ແກ້ໄຂຂໍ້ມູນສຳເລັດ"
          : "ແກ້ໄຂຂໍ້ມູນບໍ່ສຳເລັດ",
    };
  } catch (error) {
    console.log("error", error);
    throw new AppError("Server error function edit", 500);
  }
}
export async function outProduct(productId, docOut) {
  try {
    const pool = await connectDB();
    const result = await pool
      .request()
      .input("productId", sql.Int, productId)
      .input("status", sql.NVarChar, "withdrawn")
      .input("Doc_out", sql.NVarChar, docOut).query(`
      UPDATE product
      SET 
        pd_status = @status,
        pd_out_date = GETDATE(),
        pd_Document_out = @Doc_out
      WHERE pd_id = @productId
      ;
    `);
    return result.recordset;
  } catch (error) {
    console.log({ error });
    throw new AppError("Server error function outProduct", 500);
  }
}

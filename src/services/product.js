import { connectDB, sql } from "../config/db.js";
import { AppError } from "../middleware/errorHandler.js";

export async function getProducts() {
  try {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM product");
    return result.recordset;
  } catch (error) {
    throw new AppError("Server error", 500, error);
  }
}

export async function createProduct(data) {
  try {
    const pool = await connectDB();
    const { pd_customer_name, pd_customer_No_box, barcode } = data;

    const query = `
    INSERT INTO product (pd_customer_name, pd_customer_No_box, pd_incoming_date,pd_status,barcode,location_id)
    OUTPUT INSERTED.*
    VALUES (@name, @box, GETDATE(),@pdStatus,@barcode,62401)
  `;

    const request = pool.request();
    request.input("name", pd_customer_name);
    request.input("box", pd_customer_No_box);
    request.input("barcode", barcode);
    request.input("pdStatus", "in_storage");
    const result = await request.query(query);
    return result.recordset[0];
  } catch (error) {
    throw new AppError("Server error", 500, error);
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
    throw new AppError("Server error", 500, error);
  }
}

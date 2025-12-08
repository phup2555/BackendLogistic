import { connectDB, sql } from "../config/db.js";
import { AppError } from "../middleware/errorHandler.js";

export async function getRoom() {
  const pool = await connectDB();
  try {
    const result = await pool.request().query("SELECT * FROM rooms");
    return result.recordset;
  } catch (error) {
    throw new AppError("Server error", 500, error);
  }
}

export async function getZoneByRoomId(Id) {
  const pool = await connectDB();
  try {
    const result = await pool
      .request()
      .input("id", sql.Int, Id)
      .query(`SELECT DISTINCT zone FROM locations WHERE room_id = @id`);

    return result.recordset;
  } catch (error) {
    console.error("SQL ERROR:", error);
    throw new AppError("server error", 500, error);
  }
}
export async function getRowByZone(zone) {
  const pool = await connectDB();

  try {
    const query = `
      SELECT DISTINCT l.row_no
      FROM locations l
      WHERE l.zone = @zone
      AND EXISTS (
        SELECT 1 
        FROM locations l2
        LEFT JOIN product p ON l2.location_id = p.location_id 
          AND p.pd_status = 'in_storage'
        WHERE l2.zone = l.zone
          AND l2.row_no = l.row_no
          AND p.location_id IS NULL   -- แปลว่า slot นี้ยังว่าง
      )
      ORDER BY l.row_no ASC;
    `;

    const result = await pool
      .request()
      .input("zone", sql.NVarChar(10), zone)
      .query(query);

    return result.recordset;
  } catch (error) {
    console.log(error);
    throw new AppError("server error", 500, error);
  }
}
export async function getSlotByZoneRow(room, zone, row_no) {
  const pool = await connectDB();
  // console.log({ room });
  // console.log({ zone });
  // console.log({ row_no });
  try {
    const query = `
      SELECT l.slot_no, l.location_id
      FROM locations l
      LEFT JOIN product p ON l.location_id = p.location_id 
        AND p.pd_status = 'in_storage'
      WHERE l.room_id = @room
        AND l.zone = @zone
        AND l.row_no = @row_no
        AND p.location_id IS NULL   
      ORDER BY l.slot_no ASC;
    `;

    const result = await pool
      .request()
      .input("room", sql.Int, room)
      .input("zone", sql.NVarChar(10), zone)
      .input("row_no", sql.Int, row_no)
      .query(query);
    // console.log("rrrrrrrr", result.recordset);
    return result.recordset;
  } catch (error) {
    console.log(error);
    throw new AppError("server error", 500, error);
  }
}

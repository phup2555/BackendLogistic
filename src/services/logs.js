import { connectDB } from "../config/db.js";
import { AppError } from "../middleware/errorHandler.js";

export async function getLogs() {
  try {
    const pool = await connectDB();
    const result = await pool.request().query(`
        SELECT
          l.action,
          l.action_date,
          u.username,
          l.note
        FROM storage_logs l
        LEFT JOIN users u ON u.user_id = l.user_id
        ORDER BY l.action_date DESC
      `);
    return result.recordset;
  } catch (error) {
    throw new AppError("Server error", 500, error);
  }
}

export async function createLog({
  action,
  user_id,
  Pd_No_target_id,
  note,
  path,
  pd_id,
  method,
}) {
  try {
    const pool = await connectDB();
    await pool
      .request()
      .input("action", action)
      .input("path", path)
      .input("user_id", user_id)
      .input("target_id", Pd_No_target_id)
      .input("pd_id", pd_id)
      .input("method", method)
      .input("note", note).query(`
        INSERT INTO storage_logs (action, action_date, user_id, Pd_No_target_id, note,method,path,pd_id)
        VALUES (@action, GETDATE(), @user_id, @target_id, @note,@method,@path,@pd_id)
      `);
  } catch (error) {
    console.error("Log Error:", error);
  }
}

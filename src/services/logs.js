import { connectDB } from "../config/db.js";
import { AppError } from "../middleware/errorHandler.js";

export async function getLogs() {
  try {
    const pool = await connectDB();
    const result = await pool
      .request()
      .query("SELECT action,action_date,user_id,note FROM  storage_logs");
    return result.recordset;
  } catch (error) {
    throw new AppError("Server error", 500, error);
  }
}
export async function createLog({ action, user_id, target_id, note }) {
  try {
    const pool = await connectDB();
    await pool
      .request()
      .input("action", action)
      .input("user_id", user_id)
      .input("target_id", target_id)
      .input("note", note).query(`
        INSERT INTO storage_logs (action, action_date, user_id, target_id, note)
        VALUES (@action, GETDATE(), @user_id, @target_id, @note)
      `);
  } catch (error) {
    console.error("Log Error:", error);
  }
}

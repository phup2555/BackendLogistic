import { connectDB, sql } from "../config/db.js";
import { AppError } from "../middleware/errorHandler.js";
import { hashPassword } from "../util/encrypt.js";
import { getDate } from "../util/utilFunction.js";

export async function findUserByUsername(username) {
  const pool = await connectDB();

  const result = await pool.request().input("username", sql.VarChar, username)
    .query(`
      SELECT user_id, username, password, role, phoneNumber
      FROM users
      WHERE username = @username
    `);
  return result.recordset[0];
}
export async function checkUsernameUnique(username) {
  try {
    const pool = await connectDB();
    const result = await pool
      .request()
      .input("username", sql.NVarChar, username)
      .query("SELECT COUNT(*) AS count FROM users WHERE username = @username");
    return result.recordset[0].count === 0;
  } catch (error) {
    throw new AppError("Server error query Check Username Unique", 500);
  }
}
export async function getUsers() {
  try {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM users");
    return result.recordset;
  } catch (error) {
    throw new AppError("Server error", 500, error);
  }
}

export async function createUser(data) {
  try {
    const creationDate = getDate();
    const pool = await connectDB();
    const { username, fullname, password, phoneNumber, address, role } = data;

    const query = `
    INSERT INTO users (username, fullname, password, phoneNumber, address, role, created_at)
    OUTPUT INSERTED.*
    VALUES (@username, @name, @password, @phone, @address, @user_role, @creationDate) 
    
  `;
    const encryptPassword = hashPassword(password);
    // console.log({ encryptPassword });
    const request = pool.request();

    request.input("username", username);
    request.input("name", fullname);
    request.input("password", encryptPassword);
    request.input("phone", phoneNumber);
    request.input("address", address);
    request.input("user_role", role);
    request.input("creationDate", creationDate);

    const result = await request.query(query);
    return result.recordset[0];
  } catch (error) {
    console.log({ error });
    throw new AppError("Server error", 500, error);
  }
}

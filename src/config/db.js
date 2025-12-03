import sql from "mssql";
import dotenv from "dotenv";
dotenv.config();
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT) || 1433,
  options: { trustServerCertificate: true },
};

export async function connectDB() {
  const pool = new sql.ConnectionPool(dbConfig);

  try {
    await pool.connect();
    console.log("✔ Connected to SQL Server");
    return pool;
  } catch (err) {
    console.error("❌ SQL Connection Error:", err);
    throw err;
  }
}

export { sql };

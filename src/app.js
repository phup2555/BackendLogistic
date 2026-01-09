import express from "express";
import cors from "cors";
import routess from "./routes/index.js";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import sql from "mssql";
const app = express();

const pool = await connectDB();

app.use(
  cors({
    origin: [
      "https://lgstorageservice.com",
      "https://www.lgstorageservice.com",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use((req, res, next) => {
  const originalSend = res.send;

  res.send = async function (body) {
    res.send = originalSend;
    res.send(body);

    if (req.method !== "GET") {
      try {
        const pool = await connectDB();
        await pool
          .request()
          .input("headers", JSON.stringify(req.headers))
          .input("method", req.method)
          .input("url", req.originalUrl)
          .input("statusCode", res.statusCode)
          .input(
            "request",
            sql.NVarChar(sql.MAX),
            JSON.stringify(req.body ?? req.params)
          )
          .input("response", sql.NVarChar(sql.MAX), JSON.stringify(body))
          .query(`
            INSERT INTO allLogs (
              headers,
              method,
              url,
              statusCode,
              request,
              response,
              created_at
            )
            VALUES (
              @headers,
              @method,
              @url,
              @statusCode,
              @request,
              @response,
              GETDATE()
            )
          `);
      } catch (err) {
        console.error("Log save error:", err);
      }
    }
  };

  next();
});
app.use("/api", routess);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;

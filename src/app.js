import express from "express";
import cors from "cors";
// import logRoutes from "./routes/logs.js";
import routess from "./routes/index.js";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import productRoutes from "./routes/product.js";
const app = express();

app.use(cors());
app.use(express.json());

connectDB();
const pool = await connectDB();
app.use((req, res, next) => {
  const originalSend = res.send;

  res.send = async function (body) {
    res.send = originalSend;
    res.send(body);
    try {
      if (req.method !== "GET") {
        await pool
          .request()
          .input("user_id", Number(req.body?.user_id) || null)
          .input("endpoint", req.originalUrl)
          .input("actions", req.body?.action || null)
          .input("response_body", JSON.stringify(req?.body)).query(`
            INSERT INTO storage_logs (user_id, path, action, action_date, note)
            VALUES (@user_id, @endpoint, @actions, GETDATE(), @response_body)
          `);
      }
    } catch (err) {
      console.error("❌ Log error:", err);
    }

    return res;
  };

  next();
});

app.use("/api", routess);
// app.use("/api/logs", logRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;

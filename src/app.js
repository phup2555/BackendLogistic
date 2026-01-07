import express from "express";
import cors from "cors";
import routess from "./routes/index.js";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";

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

app.use("/api", routess);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;

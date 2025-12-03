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

// Connect to SQL Server
connectDB();

app.use("/api", routess);
// app.use("/api/logs", logRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;

import express from "express";
import cors from "cors";
import routess from "./routes/index.js";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const pool = await connectDB();

// 🔹 CORS Configuration
const whitelist = [
  "https://lgstorageservice.com",
  "https://www.lgstorageservice.com",
  "http://localhost:5173",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

// 🔹 Socket.IO
export const io = new Server(server, {
  cors: {
    origin: whitelist,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);
  socket.on("disconnect", () =>
    console.log("🔴 Socket disconnected:", socket.id)
  );
});

// 🔹 Routes
app.use("/api", routess);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`🚀 Server running with socket on port ${PORT}`)
);

export default app;

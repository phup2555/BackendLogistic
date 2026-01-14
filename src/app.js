import express from "express";
import cors from "cors";
import routess from "./routes/index.js";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import http from "http";
import { Server } from "socket.io";
import { sql } from "./config/db.js";
const app = express();
const server = http.createServer(app);

const pool = await connectDB();

const whitelist = [
  "https://sboxlaos.com",
  "https://www.sboxlaos.com",
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
app.use((req, res, next) => {
  const originalSend = res.send;

  res.send = async function (body) {
    res.send = originalSend;
    res.send(body);

    if (req.method !== "GET") {
      console.log("method", req.method);
      console.log("req.headers", req.headers);
      console.log("req.originalUrl", req.originalUrl);
      console.log("res.statusCode", res.statusCode);
      console.log("req.body", req.body);
      console.log("req.params", req.params);
      console.log("response body", body);
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

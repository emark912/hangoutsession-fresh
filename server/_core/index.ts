import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { router } from "../routers";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { createContext } from "./context";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { handleStripeWebhook } from "./stripe";
import { handleSocketConnection } from "./websocket";

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { origin: process.env.VITE_APP_URL || "http://localhost:5173" },
});

// Middleware
app.use(cors({ origin: process.env.VITE_APP_URL || "http://localhost:5173", credentials: true }));
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Stripe webhook (raw body)
app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

// JSON parsing
app.use(express.json());

// tRPC
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router,
    createContext,
  })
);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// WebSocket
io.on("connection", (socket) => {
  handleSocketConnection(socket, io);
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err);
  res.status(err.statusCode || 500).json({
    error: err.message || "Internal server error",
  });
});

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 HangoutSession server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready`);
});

export { app, io };

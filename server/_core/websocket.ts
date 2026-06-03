import { Socket, Server as SocketIOServer } from "socket.io";
import { db } from "../db";
import { messages } from "../../drizzle/schema";

export function handleSocketConnection(socket: Socket, io: SocketIOServer) {
  console.log(`📱 User connected: ${socket.id}`);

  // Join user room
  socket.on("join", (userId: string) => {
    socket.join(`user_${userId}`);
    console.log(`✅ User ${userId} joined room`);
  });

  // Handle new message
  socket.on("send_message", async (data: { senderId: string; receiverId: string; bookingId?: string; content: string }) => {
    try {
      // Save message to database
      const messageId = `msg_${Date.now()}`;
      await db.insert(messages).values({
        id: messageId,
        senderId: data.senderId,
        receiverId: data.receiverId,
        bookingId: data.bookingId,
        content: data.content,
        read: false,
      });

      // Emit to receiver
      io.to(`user_${data.receiverId}`).emit("new_message", {
        id: messageId,
        senderId: data.senderId,
        receiverId: data.receiverId,
        bookingId: data.bookingId,
        content: data.content,
        timestamp: new Date(),
      });

      // Confirm to sender
      socket.emit("message_sent", { id: messageId });
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("message_error", { error: "Failed to send message" });
    }
  });

  // Handle typing indicator
  socket.on("typing", (data: { receiverId: string }) => {
    io.to(`user_${data.receiverId}`).emit("user_typing");
  });

  // Handle stop typing
  socket.on("stop_typing", (data: { receiverId: string }) => {
    io.to(`user_${data.receiverId}`).emit("user_stop_typing");
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log(`👋 User disconnected: ${socket.id}`);
  });
}

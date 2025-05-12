import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js";
import "./utils/scheduler.js";

// Импорт маршрутов
import appointmentRoutes from "./routes/appointments.js";
import reviewRoutes from "./routes/reviews.js";
import galleryRoutes from "./routes/gallery.js";
import authRoutes from "./routes/auth.js";
import telegramRoutes from "./routes/telegram.js";
import serviceRoutes from "./routes/service.js";
import calendarRoutes from "./routes/calendar.js";
import userRoutes from "./routes/user.js";
import adminRoutes from './routes/admin.js';
import masterRoutes from './routes/master.js';

// Инициализация
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Подключаем базу данных
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Главный маршрут
app.get("/", (req, res) => {
    res.send("✅ Backend успешно запущен на Vercel!");
});

// Подключаем маршруты
app.use("/api/appointments", appointmentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/telegram", telegramRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/masters", masterRoutes);

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

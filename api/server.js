import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js";
import "./utils/scheduler.js";

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

// Загружаем конфигурацию
dotenv.config();

// Подключаем базу данных
connectDB();

// Инициализируем Express
const app = express();
app.use(express.json());
app.use(cors());

// Подключаем API маршруты
app.use("/api/appointments", appointmentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/telegram", telegramRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/users", userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/masters', masterRoutes);

// Запускаем сервер
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

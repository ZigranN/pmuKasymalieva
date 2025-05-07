import express from "express";
import {
    getAllAppointmentsForAdmin,
    updateAppointmentStatus,
    deleteAppointment
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔍 Все записи с фильтрацией (для админа)
router.get("/appointments", protect, adminOnly, getAllAppointmentsForAdmin);

// ✏️ Обновление статуса записи
router.patch("/appointments/:id", protect, adminOnly, updateAppointmentStatus);

// ❌ Удаление записи
router.delete("/appointments/:id", protect, adminOnly, deleteAppointment);

export default router;

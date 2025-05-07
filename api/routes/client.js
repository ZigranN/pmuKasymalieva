import express from "express";
import {
    getClientAppointments,
    createAppointment,
    getAvailableSlots,
} from "../controllers/appointmentsController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * ➕ Создание новой записи
 * @route POST /api/client/appointments
 * @access Client
 */
router.post("/appointments", protect, createAppointment);

/**
 * 🔎 Получение всех записей клиента
 * @route GET /api/client/appointments
 * @access Client
 */
router.get("/appointments", protect, getClientAppointments);

/**
 * 🔎 Получение доступных слотов по дате
 * @route GET /api/client/appointments/available
 * @access Client
 */
router.get("/appointments/available", getAvailableSlots);

export default router;

import express from "express";
import {
    createAppointment,
    filterAppointments,
    getAppointmentsByService,
    getAvailableSlots
} from "../controllers/appointmentsController.js";
import {adminOnly, protect} from "../middlewares/authMiddleware.js";
import {body, query} from "express-validator";
import {validateRequest} from "../middlewares/validationMiddleware.js";
import {getAllAppointmentsForAdmin} from "../controllers/adminController.js";

const router = express.Router();

// ✅ Создание записи с валидацией
router.post(
    "/", protect,
    [
        body("name").isString().withMessage("Имя должно быть строкой"),
        body("phone").matches(/^\+?\d{9,15}$/).withMessage("Некорректный номер телефона"),
        body("date").isISO8601().withMessage("Дата должна быть в формате YYYY-MM-DD"),
        body("slotTime").matches(/^(09:00|12:00|15:00)$/).withMessage("Некорректное время записи"),
        body("email").isEmail().optional().withMessage("Некорректный email")
    ],
    validateRequest,
    createAppointment
);

// ✅ Получение доступных слотов
router.get(
    "/available",
    [
        query("date").isISO8601().withMessage("Дата должна быть в формате YYYY-MM-DD")
    ],
    validateRequest,
    getAvailableSlots
);

// ✅ Только админ может видеть все записи
router.get("/", protect, adminOnly, getAllAppointmentsForAdmin);

router.get("/service/:serviceId", protect, adminOnly, getAppointmentsByService); // 🔎 Фильтр по услуге
router.get("/filter", protect, adminOnly, filterAppointments);    // 🔎 Фильтрация по дате и услуге

export default router;

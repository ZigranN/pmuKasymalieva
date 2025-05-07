import express from "express";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import {getCalendarForDate} from "../controllers/calendarControllers.js";

const router = express.Router();

// 📅 Маршрут получения календаря на день
router.get("/", protect, adminOnly, getCalendarForDate);

export default router;

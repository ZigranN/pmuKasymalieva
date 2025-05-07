import express from "express";
import {
    getAllServices,
    createService,
    updateService,
    deleteService
} from "../controllers/serviceController.js";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllServices);                          // 🔎 Получить все услуги
router.post("/", protect, adminOnly, createService);      // ➕ Создать новую услугу
router.put("/:id", protect, adminOnly, updateService);    // ✏️ Обновить услугу
router.delete("/:id", protect, adminOnly, deleteService); // ❌ Удалить услугу

export default router;

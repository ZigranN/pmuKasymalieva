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
router.post("/",  createService);      // ➕ Создать новую услугу
router.put("/:id",  updateService);    // ✏️ Обновить услугу
router.delete("/:id", deleteService); // ❌ Удалить услугу

export default router;

import express from "express";
import {
    createMaster,
    updateMaster,
    deleteMaster, getAllMasters
} from '../controllers/masterController.js';
import upload from "../middlewares/upload.js";

const router = express.Router();

// ➡️ Создание мастера
router.get('/', getAllMasters);

router.post('/', upload.single('photo'), createMaster);
// ➡️ Обновление мастера

router.put('/:id', upload.single('photo'), updateMaster);
// ➡️ Удаление мастера

router.delete('/:id', deleteMaster);

export default router;

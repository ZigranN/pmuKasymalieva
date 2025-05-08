import express from 'express';
import {
    createClient,
    getAllClients,
    updateClient,
    deleteClient
} from '../controllers/userController.js';

const router = express.Router();

/**
 * 📌 Создать клиента
 * @route POST /api/users
 */
router.post('/', createClient);

/**
 * 📌 Получить всех клиентов
 * @route GET /api/users
 */
router.get('/', getAllClients);

/**
 * 📌 Обновить данные клиента
 * @route PUT /api/users/:id
 */
router.put('/:id', updateClient);

/**
 * 📌 Удалить клиента
 * @route DELETE /api/users/:id
 */
router.delete('/:id', deleteClient);

export default router;

import User from '../models/User.js';

/**
 * 📌 Создать нового клиента
 * @route POST /api/users
 */
export const createClient = async (req, res) => {
    try {
        const {
            firstName, lastName, phone, email, birthDate,
            notes, comments, childrenCount, childrenAges,
            firstAppointmentDate, nextAppointmentDate, serviceId, additionalServiceIds
        } = req.body;

        const newClient = new User({
            firstName, lastName, phone, email, birthDate,
            notes, comments, childrenCount, childrenAges,
            firstAppointmentDate, nextAppointmentDate, serviceId, additionalServiceIds
        });

        await newClient.save();
        res.status(201).json({ message: 'Клиент успешно создан', client: newClient });
    } catch (error) {
        console.error('Ошибка при создании клиента:', error.message);
        res.status(500).json({ message: 'Ошибка на сервере' });
    }
};

/**
 * 📌 Получить всех клиентов
 * @route GET /api/users
 */
export const getAllClients = async (req, res) => {
    try {
        const clients = await User.find();
        res.status(200).json(clients);
    } catch (error) {
        console.error('Ошибка при получении клиентов:', error.message);
        res.status(500).json({ message: 'Ошибка на сервере' });
    }
};

/**
 * 📌 Обновить данные клиента
 * @route PUT /api/users/:id
 */
export const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedClient = await User.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedClient) {
            return res.status(404).json({ message: 'Клиент не найден' });
        }

        res.status(200).json({ message: 'Данные клиента обновлены', client: updatedClient });
    } catch (error) {
        console.error('Ошибка при обновлении клиента:', error.message);
        res.status(500).json({ message: 'Ошибка на сервере' });
    }
};

/**
 * 📌 Удалить клиента
 * @route DELETE /api/users/:id
 */
export const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedClient = await User.findByIdAndDelete(id);

        if (!deletedClient) {
            return res.status(404).json({ message: 'Клиент не найден' });
        }

        res.status(200).json({ message: 'Клиент успешно удалён' });
    } catch (error) {
        console.error('Ошибка при удалении клиента:', error.message);
        res.status(500).json({ message: 'Ошибка на сервере' });
    }
};

import Appointment from "../models/Appointment.js";
import Service from "../models/Service.js";
import User from "../models/User.js";

export const getAllAppointmentsForAdmin = async (req, res) => {
    try {
        const { date, serviceId, status } = req.query;

        const filter = {};

        if (date) filter.date = date;
        if (serviceId) filter.serviceId = serviceId;
        if (status) filter.status = status;

        const appointments = await Appointment.find(filter)
            .populate("serviceId", "name price duration")
            .populate("userId", "name email phone")
            .sort({ date: 1, slotTime: 1 });

        res.status(200).json(appointments);
    } catch (error) {
        console.error("Ошибка при получении записей:", error.message);
        res.status(500).json({ message: "Ошибка на сервере" });
    }
};

export const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["pending", "confirmed", "completed", "canceled"].includes(status)) {
            return res.status(400).json({ message: "Некорректный статус" });
        }

        const appointment = await Appointment.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate("serviceId", "name price duration")
            .populate("userId", "name email phone");

        if (!appointment) {
            return res.status(404).json({ message: "Запись не найдена" });
        }

        res.status(200).json({
            message: "Статус успешно обновлён",
            appointment
        });
    } catch (error) {
        console.error("Ошибка при обновлении статуса записи:", error.message);
        res.status(500).json({ message: "Ошибка на сервере" });
    }
};

export const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedAppointment = await Appointment.findByIdAndDelete(id);

        if (!deletedAppointment) {
            return res.status(404).json({ message: "Запись не найдена" });
        }

        res.status(200).json({ message: "Запись успешно удалена" });
    } catch (error) {
        console.error("Ошибка при удалении записи:", error.message);
        res.status(500).json({ message: "Ошибка на сервере" });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        // 1️⃣ Считаем количество пользователей
        const totalUsers = await User.countDocuments();

        // 2️⃣ Считаем количество записей
        const totalAppointments = await Appointment.countDocuments();

        // 3️⃣ Считаем количество услуг
        const totalServices = await Service.countDocuments();

        // 5️⃣ Формируем объект статистики
        const stats = {
            totalUsers,             // Количество пользователей
            totalAppointments,      // Количество записей
            totalServices,          // Количество услуг
        };

        // ✅ Возвращаем данные на фронтенд
        res.status(200).json(stats);
    } catch (error) {
        console.error('Ошибка при получении статистики:', error.message);
        res.status(500).json({ message: 'Ошибка на сервере' });
    }
};

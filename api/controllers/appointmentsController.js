import Appointment from "../models/Appointment.js";
import Service from "../models/Service.js";
import { sendAppointmentEmail } from "../utils/sendEmail.js";
import { sendTelegramMessage } from "../utils/sendTelegramMessage.js";

export const createAppointment = async (req, res) => {
    try {
        const {
            name,
            phone,
            comment,
            photo,
            date,
            slotTime,
            serviceId,
            telegramChatId,
            email
        } = req.body;

        if (!name || !phone || !date || !slotTime || !serviceId) {
            return res.status(400).json({
                message: "Все поля обязательны: имя, телефон, дата, время, услуга.",
            });
        }

        // ✅ Проверяем, занят ли слот
        const existingAppointment = await Appointment.findOne({ date, slotTime, serviceId });
        if (existingAppointment) {
            return res.status(409).json({
                message: "Слот уже занят. Пожалуйста, выберите другое время.",
            });
        }

        // ✅ Создание новой записи
        const newAppointment = new Appointment({
            name,
            phone,
            comment,
            photo,
            date,
            slotTime,
            serviceId,
            userId: req.user._id,
            telegramChatId,
            email
        });

        await newAppointment.save();

        // ✅ Отправляем уведомления
        if (telegramChatId) {
            await sendTelegramMessage(
                telegramChatId,
                `👋 Новая запись на процедуру!\n📅 <b>Дата:</b> ${date}\n🕒 <b>Время:</b> ${slotTime}\n💅 <b>Услуга:</b> ${serviceId}\n📞 <b>Телефон:</b> ${phone}`
            );
        }

        if (email) {
            await sendAppointmentEmail({
                name,
                phone,
                date,
                slotTime,
                comment,
                serviceId,
                email,
            });
        }

        res.status(201).json({
            message: "Запись успешно создана",
            appointment: newAppointment,
        });
    } catch (error) {
        console.error("Ошибка при создании записи:", error.message);
        res.status(500).json({ message: "Ошибка на сервере при создании записи" });
    }
};

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

export const getAvailableSlots = async (req, res) => {
    try {
        const { date, serviceId } = req.query;

        if (!date || !serviceId) {
            return res.status(400).json({ message: "Укажите дату и услугу" });
        }

        const allSlots = ["09:00", "12:00", "15:00"];
        const booked = await Appointment.find({ date, serviceId }).select("slotTime -_id");
        const bookedSlots = booked.map(a => a.slotTime);

        const availableSlots = allSlots.filter(s => !bookedSlots.includes(s));

        res.json({ date, availableSlots });
    } catch (error) {
        console.error("Ошибка при получении слотов:", error.message);
        res.status(500).json({ message: "Ошибка сервера при получении слотов" });
    }
};

export const getClientAppointments = async (req, res) => {
    try {
        const userId = req.user._id;

        const appointments = await Appointment.find({ userId })
            .populate("serviceId", "name price duration")
            .sort({ date: 1, slotTime: 1 });

        res.status(200).json(appointments);
    } catch (error) {
        console.error("Ошибка при получении записей клиента:", error.message);
        res.status(500).json({ message: "Ошибка на сервере" });
    }
};

export const getAppointmentsByService = async (req, res) => {
    try {
        const { serviceId } = req.params;

        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: "Услуга не найдена" });
        }

        const appointments = await Appointment.find({ serviceId }).sort({ date: 1, slotTime: 1 });

        res.status(200).json({
            service: service.name,
            appointments
        });
    } catch (error) {
        console.error("Ошибка при получении записей по услуге:", error.message);
        res.status(500).json({ message: "Ошибка сервера при получении записей" });
    }
};

export const filterAppointments = async (req, res) => {
    try {
        const { date, serviceId } = req.query;

        // Формируем объект фильтра
        const filter = {};
        if (date) filter.date = date;
        if (serviceId) filter.serviceId = serviceId;

        const appointments = await Appointment.find(filter)
            .populate("serviceId", "name price duration")
            .populate("userId", "name email phone")
            .sort({ date: 1, slotTime: 1 });

        res.status(200).json({
            message: "Записи успешно получены",
            appointments,
        });
    } catch (error) {
        console.error("Ошибка при фильтрации записей:", error.message);
        res.status(500).json({ message: "Ошибка сервера при получении записей" });
    }
};



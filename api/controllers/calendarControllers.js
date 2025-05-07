import Appointment from "../models/Appointment.js";
import Service from "../models/Service.js";

/**
 * 📅 Получить календарь на конкретный день
 * @route GET /api/calendar
 * @query { date, serviceId }
 */
export const getCalendarForDate = async (req, res) => {
    try {
        const { date, serviceId } = req.query;

        if (!date) {
            return res.status(400).json({ message: "Необходимо указать дату" });
        }

        // Все стандартные слоты времени
        const allSlots = ["09:00", "12:00", "15:00"];

        // Формируем фильтр
        const filter = { date };
        if (serviceId) {
            filter.serviceId = serviceId;
        }

        // Забронированные записи на эту дату
        const appointments = await Appointment.find(filter)
            .populate("serviceId", "name")
            .populate("userId", "name phone");

        // Маппинг всех слотов
        const slots = allSlots.map((time) => {
            const appointment = appointments.find((a) => a.slotTime === time);

            if (appointment) {
                return {
                    time,
                    status: "booked",
                    appointment: {
                        _id: appointment._id,
                        name: appointment.name,
                        phone: appointment.phone,
                        service: appointment.serviceId.name,
                    }
                };
            } else {
                return {
                    time,
                    status: "free",
                };
            }
        });

        res.status(200).json({
            date,
            slots
        });

    } catch (error) {
        console.error("Ошибка при получении календаря:", error.message);
        res.status(500).json({ message: "Ошибка на сервере" });
    }
};

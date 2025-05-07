import cron from "node-cron";
import Appointment from "../models/Appointment.js";
import { sendTelegramMessage } from "./sendTelegramMessage.js";
import { sendAppointmentEmail } from "./sendEmail.js";
import moment from "moment";

// ✅ Запуск каждый час
cron.schedule("0 * * * *", async () => {
    console.log("🔄 Проверка на необходимость уведомлений...");

    // Получаем все будущие записи
    const appointments = await Appointment.find({ status: "confirmed" });

    appointments.forEach(async (appointment) => {
        const appointmentTime = moment(`${appointment.date} ${appointment.slotTime}`, "YYYY-MM-DD HH:mm");
        const now = moment();

        // Проверка на 24 часа
        if (!appointment.notified24h && appointmentTime.diff(now, 'hours') === 24) {
            console.log(`⏰ Уведомление за 24 часа: ${appointment.name}`);

            // Отправляем уведомление
            if (appointment.telegramChatId) {
                await sendTelegramMessage(appointment.telegramChatId, `
                ⏰ Напоминание!
                Завтра в ${appointment.slotTime} у вас запись на процедуру. Пожалуйста, не забудьте!
                `);
            }

            if (appointment.email) {
                await sendAppointmentEmail({
                    name: appointment.name,
                    phone: appointment.phone,
                    date: appointment.date,
                    slotTime: appointment.slotTime,
                    comment: "Напоминание за 24 часа до процедуры"
                });
            }

            // Помечаем как отправленное
            appointment.notified24h = true;
            await appointment.save();
        }

        // Проверка на 2 часа
        if (!appointment.notified2h && appointmentTime.diff(now, 'hours') === 2) {
            console.log(`⏰ Уведомление за 2 часа: ${appointment.name}`);

            if (appointment.telegramChatId) {
                await sendTelegramMessage(appointment.telegramChatId, `
                ⏰ Напоминание!
                Через 2 часа в ${appointment.slotTime} у вас запись на процедуру.
                Пожалуйста, будьте вовремя!
                `);
            }

            if (appointment.email) {
                await sendAppointmentEmail({
                    name: appointment.name,
                    phone: appointment.phone,
                    date: appointment.date,
                    slotTime: appointment.slotTime,
                    comment: "Напоминание за 2 часа до процедуры"
                });
            }

            // Помечаем как отправленное
            appointment.notified2h = true;
            await appointment.save();
        }
    });
});

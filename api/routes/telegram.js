import express from "express";
import Appointment from "../models/Appointment.js";

const router = express.Router();

router.post("/webhook", async (req, res) => {
    const message = req.body.message;

    if (!message || !message.chat || !message.text) return res.sendStatus(200);

    const chatId = message.chat.id;
    const firstName = message.chat.first_name || "";
    const text = message.text;

    // Пытаемся найти номер телефона в сообщении
    const phoneRegex = /\+?\d{9,15}/;
    const phoneMatch = text.match(phoneRegex);

    if (text.startsWith("/start")) {
        const replyText = `Здравствуйте, ${firstName}! Пожалуйста, отправьте ваш номер телефона, чтобы мы могли подключить уведомления. 📲`;

        await sendTelegramMessage(chatId, replyText);
    }

    if (phoneMatch) {
        const phone = phoneMatch[0];

        // Найдём последнюю запись с этим номером
        const appointment = await Appointment.findOne({ phone }).sort({ createdAt: -1 });

        if (appointment) {
            appointment.telegramChatId = chatId;
            await appointment.save();

            await sendTelegramMessage(chatId, `✅ Спасибо! Мы будем присылать вам уведомления о записи.`);
        } else {
            await sendTelegramMessage(chatId, `⚠️ Не найдено активной записи с этим номером. Попробуйте позже.`);
        }
    }

    res.sendStatus(200);
});

// Вспомогательная функция
const sendTelegramMessage = async (chatId, text) => {
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
    });
};

export default router;

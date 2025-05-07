import axios from "axios";

export const sendTelegramMessage = async (chatId, text) => {
    try {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const url = `https://api.telegram.org/bot7007941325:AAHoVSPd4sEoOjK0YRtxlZwphtPNmZDxdp8/sendMessage`;

        await axios.post(url, {
            chat_id: chatId,
            text,
            parse_mode: "HTML",
        });
    } catch (error) {
        console.error("❌ Ошибка при отправке Telegram:", error.message);
    }
};

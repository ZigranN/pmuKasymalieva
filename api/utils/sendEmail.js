import nodemailer from "nodemailer";

export const sendAppointmentEmail = async ({ name, phone, date, slotTime, comment }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,     // Твой Gmail
                pass: process.env.EMAIL_PASS      // Пароль приложения
            }
        });

        const mailOptions = {
            from: `"PMU Zapic" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_RECEIVER, // email мастера
            subject: "Новая запись на процедуру",
            html: `
        <h3>Новая запись</h3>
        <p><strong>Имя:</strong> ${name}</p>
        <p><strong>Телефон:</strong> ${phone}</p>
        <p><strong>Дата:</strong> ${date}</p>
        <p><strong>Время:</strong> ${slotTime}</p>
        <p><strong>Комментарий:</strong> ${comment || "—"}</p>
      `
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("❌ Ошибка отправки email:", error);
    }
};

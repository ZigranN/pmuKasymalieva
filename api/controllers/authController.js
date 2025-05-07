import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Все поля обязательны для заполнения" });
        }
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "Пользователь уже существует" });

        const user = await User.create({
            name: name.trim(),
            email: email.trim(),
            password
        });
        res.status(201).json({
            message: "Регистрация прошла успешно!",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isClient: user.isClient,
            },
            token: generateToken(user._id),
        });
    } catch (err) {
        res.status(500).json({ message: "Ошибка регистрации" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Пожалуйста, введите email и пароль" });
        }

        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            res.status(200).json({
                message: "Вход выполнен успешно!",
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin
                },
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: "Неправильный email или пароль" });
        }
    } catch (err) {
        console.error("Ошибка авторизации:", err.message);
        res.status(500).json({ message: "Ошибка на сервере при авторизации" });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Укажите email" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Пользователь не найден" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpires = Date.now() + 1000 * 60 * 30; // 30 минут
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        to: user.email,
        from: process.env.EMAIL_USER,
        subject: "Сброс пароля",
        html: `
      <p>Вы запросили сброс пароля</p>
      <p><a href="${resetLink}">Нажмите здесь для смены пароля</a></p>
    `
    });

    res.json({ message: "Ссылка отправлена на email" });
};
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
        resetToken: token,
        resetTokenExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: "Неверная или истёкшая ссылка" });

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.json({ message: "Пароль успешно изменён" });
};


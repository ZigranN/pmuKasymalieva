import Review from "../models/Review.js";

// 📌 POST /api/reviews
export const createReview = async (req, res) => {
    try {
        const { name, text, rating } = req.body;

        if (!name || !text || !rating) {
            return res.status(400).json({ message: "Имя, текст и рейтинг обязательны" });
        }

        const review = new Review({ name, text, rating });
        await review.save();

        res.status(201).json({ message: "Отзыв успешно добавлен", review });
    } catch (error) {
        console.error("Ошибка при создании отзыва:", error);
        res.status(500).json({ message: "Ошибка сервера при создании отзыва" });
    }
};

// 📌 GET /api/reviews
export const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 }).limit(20);
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера при получении отзывов" });
    }
};

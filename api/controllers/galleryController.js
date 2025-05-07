import Gallery from "../models/Gallery.js";

export const addImage = async (req, res) => {
    try {
        const { category, description } = req.body;

        if (!category || !["brows", "lips", "eyeliner"].includes(category)) {
            return res.status(400).json({ message: "Неверная категория (brows, lips, eyeliner)" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Файл изображения обязателен" });
        }

        const imageUrl = `/uploads/${req.file.filename}`;
        const item = new Gallery({ category, description, imageUrl });
        await item.save();

        res.status(201).json({ message: "Изображение добавлено", item });
    } catch (error) {
        console.error("Ошибка загрузки изображения:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

export const getGallery = async (req, res) => {
    try {
        const items = await Gallery.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера при загрузке галереи" });
    }
};

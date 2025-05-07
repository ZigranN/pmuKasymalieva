import Service from "../models/Service.js";
import mongoose from "mongoose";

// 📌 Получение всех услуг
export const getAllServices = async (req, res) => {
    try {
        const services = await Service.find().sort({ name: 1 });
        res.status(200).json(services);
    } catch (error) {
        console.error("Ошибка при получении списка услуг:", error.message);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

// 📌 Создание новой услуги
export const createService = async (req, res) => {
    try {
        const { name, description, price, duration } = req.body;

        if (!name || !price || !duration) {
            return res.status(400).json({ message: "Поля name, price и duration обязательны" });
        }

        // Проверка на дубликат по имени
        const existingService = await Service.findOne({ name });
        if (existingService) {
            return res.status(400).json({ message: "Услуга с таким именем уже существует" });
        }

        const newService = new Service({ name, description, price, duration });
        await newService.save();

        res.status(201).json(newService);
    } catch (error) {
        console.error("Ошибка при создании услуги:", error.message);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

// 📌 Обновление услуги
export const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, duration } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Неверный ID услуги" });
        }

        const updatedService = await Service.findByIdAndUpdate(
            id,
            { name, description, price, duration },
            { new: true, runValidators: true }
        );

        if (!updatedService) {
            return res.status(404).json({ message: "Услуга не найдена" });
        }

        res.status(200).json(updatedService);
    } catch (error) {
        console.error("Ошибка при обновлении услуги:", error.message);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

// 📌 Удаление услуги
export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Неверный ID услуги" });
        }

        const deletedService = await Service.findByIdAndDelete(id);

        if (!deletedService) {
            return res.status(404).json({ message: "Услуга не найдена" });
        }

        res.status(200).json({ message: "Услуга успешно удалена" });
    } catch (error) {
        console.error("Ошибка при удалении услуги:", error.message);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

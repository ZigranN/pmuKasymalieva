import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Название услуги обязательно"],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    price: {
        type: Number,
        required: [true, "Цена обязательна"],
        min: [0, "Цена не может быть отрицательной"]
    },
    duration: {
        type: String, // длительность в минутах
        required: [true, "Продолжительность обязательна"],
    }
}, { timestamps: true });

export default mongoose.model("Service", serviceSchema);

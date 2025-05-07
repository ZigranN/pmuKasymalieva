import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    comment: {
        type: String,
        default: "",
    },
    photo: {
        type: String,
        default: "",
    },
    date: {
        type: String, // YYYY-MM-DD
        required: true,
    },
    slotTime: {
        type: String, // HH:mm, например: "09:00"
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "completed"],
        default: "pending",
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    telegramChatId: { type: String },
    email: { type: String },
}, { timestamps: true });

appointmentSchema.index({ date: 1, slotTime: 1, serviceId: 1 }, { unique: true });

export default mongoose.model("Appointment", appointmentSchema);

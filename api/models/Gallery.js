import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
    category: { type: String, enum: ["brows", "lips", "eyeliner"], required: true },
    imageUrl: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Gallery", gallerySchema);

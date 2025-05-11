// models/Master.js

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const masterSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    photoUrl: {
        type: String,
        default: null  // Ссылка на изображение
    },
    services: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Service',
            required: true
        }
    ],
    rating: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, {
    timestamps: true
});

export default mongoose.model('Master', masterSchema);

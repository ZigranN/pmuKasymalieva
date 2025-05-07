import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Имя обязательно"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email обязателен"],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Пароль обязателен"],
        trim: true
    },
    isClient: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });


// 🔐 Хэширование пароля перед сохранением
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// ✅ Метод для сравнения пароля
userSchema.methods.comparePassword = function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
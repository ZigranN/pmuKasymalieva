import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    telegram: { type: String },  // Новый параметр
    whatsapp: { type: String },  // Новый параметр
    birthDate: { type: Date },
    notes: { type: String },
    serviceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    additionalServiceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    firstAppointmentDate: { type: Date },
    secondAppointmentDate: { type: Date },
    nextAppointmentDate: { type: Date },
    comments: { type: String },
    childrenCount: { type: Number },
    childrenAge: [{ type: Number }],

}, { timestamps: true });

export default mongoose.model('User', UserSchema);

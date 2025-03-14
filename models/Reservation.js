const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    professionalId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    details: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);

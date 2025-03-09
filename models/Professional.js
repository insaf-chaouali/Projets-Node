const mongoose = require("mongoose");

const professionalSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    title: { type: String, enum: ["Médecin", "Comptable", "Avocat"], required: true },
    specialty: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model("Professional", professionalSchema);

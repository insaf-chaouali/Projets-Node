const mongoose = require('mongoose');
require('dotenv').config(); // Assurez-vous que le fichier .env est correctement configuré

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ Could not connect to MongoDB:', err));

// Schéma de l'utilisateur
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['admin', 'client', 'professionnel'], 
        required: true 
    },
    dateOfBirth: { type: Date },
    status: { type: String, default: 'Actif' },
    cityAddress: { type: String },
    situationFamiliale: String,
    nationalite: String,
    typePieceIdentite: String,
    numeroPieceIdentite: String,
    dateEmissionPieceIdentite: String,
    lieuEmissionPieceIdentite: String,
    dateExpirationPieceIdentite: String
}, { timestamps: true }); // Ajout de timestamps (createdAt, updatedAt)

// Création du modèle basé sur le schéma
//const User = mongoose.model("User", userSchema);

//module.exports = User;
module.exports = mongoose.model('User', userSchema);
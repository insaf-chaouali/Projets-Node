const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
    
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
    },
    password: { 
        type: String, 
        required: true, 
    },
    role: { 
        type: String, 
        enum: ['admin', 'client', 'professionnel'], 
        required: true 
    },
    dateOfBirth: { 
        type: Date 
    },
    status: { 
        type: String, 
        default: 'Actif',
        enum: ['Actif', 'Inactif', 'Suspendu']
    },
    cityAddress: { 
        type: String,
        default: 'Non spécifié'
    },
    role: { 
        type: String, 
        enum: ['admin', 'client', 'professionnel'], 
        required: true 
    },
    job: { 
        type: String 
<<<<<<< HEAD
    },
    city:{
        type : String
=======
>>>>>>> eeebb862438e97a1348f32c41a0db4a94f65407b
    }
});

// Middleware pour hacher le mot de passe avant de sauvegarder l'utilisateur

const User = mongoose.model('User', userSchema);

module.exports = User;
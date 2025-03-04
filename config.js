const mongoose = require('mongoose');
require('dotenv').config(); // Ensure the .env file is correctly configured

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ Could not connect to MongoDB:', err));

// User schema
const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
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
        default: 'Actif' 
    },
    cityAddress: { 
        type: String 
    },
    job: { 
        type: String 
    }
}, { 
    timestamps: true // Adds createdAt and updatedAt fields
});

// Create the User model based on the schema
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;
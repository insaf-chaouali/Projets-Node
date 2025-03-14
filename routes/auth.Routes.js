const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const isAuthenticated = require('../middleware/isAuthenticated');
require('dotenv').config();
// Route pour l'inscription
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password: rawPassword, role, dateOfBirth, status, cityAddress, job } = req.body;

        // Nettoyage du mot de passe
        const password = rawPassword.trim(); // ✅ Correction clé

        // Validation du rôle
        if (!['admin', 'client', 'professionnel'].includes(role)) {
            return res.status(400).send("Rôle invalide !");
        }

        // Vérification de l'unicité
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).send("L'utilisateur existe déjà");
        }

        // Hashage sécurisé
        const hashedPassword = await bcrypt.hash(password, 10);

        // Création de l'utilisateur
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role,
            dateOfBirth,
            status,
            cityAddress,
            job: role === 'professionnel' ? job : null
        });

        // Sauvegarde et logs
        const userdata = await newUser.save();
        console.log("Mot de passe nettoyé à l'inscription:", password); // 🔍 Debug
        console.log("Utilisateur enregistré:", userdata);
        
        res.redirect('/login');
    } catch (error) {
        console.error("Erreur d'inscription:", error);
        res.status(500).send("Erreur serveur");
    }
});

// Route pour la connexion
router.post('/login', async (req, res) => {
    const { username, password: rawPassword } = req.body;
    const password = rawPassword.trim(); // ✅ Nettoyage cohérent

    try {
        // Recherche de l'utilisateur
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Identifiants incorrects' });
        }

        // Logs de vérification
        console.log("Mot de passe saisi (nettoyé):", password);
        console.log("Hash stocké:", user.password);

        // Comparaison sécurisée
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Résultat comparaison:", isMatch);

        if (!isMatch) {
            console.error("Échec de correspondance du hash");
            return res.status(401).json({ message: 'Identifiants incorrects' });
        }

        // Génération du token JWT
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '10d' }
        );

        res.json({ token, role: user.role });
    } catch (error) {
        console.error("Erreur de connexion:", error);
        res.status(500).send("Erreur serveur");
    }
});
router.get('/me', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password -__v');
        
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        
        res.json({
            username: user.username,
            email: user.email,
            role: user.role,
            cityAddress: user.cityAddress,
            job: user.job,
            dateOfBirth:user.dateOfBirth,
            status:user.status,
            city:user.city
        
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});
router.put('/update', isAuthenticated, async (req, res) => {
    try {
        const { username, email, city, status, cityAddress, job } = req.body;
        const userId = req.user.id;

        // Validation des données (optionnel)
        if (!username || !email) {
            return res.status(400).json({ message: "Nom d'utilisateur et email sont requis" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, email, city, status, cityAddress, job },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(400).json({ message: "Erreur de mise à jour" });
        }

        res.json({ message: "Profil mis à jour avec succès", user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});
router.get('/profile/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID invalide" });
        }

        const user = await User.findById(id); // Remplacer Client par User
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/Professionnel', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

router.put('/Update', isAuthenticated, async (req, res) => {
    try {
        const { username, job, cityAddress } = req.body;
        const userId = req.user.id;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, job, cityAddress },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(400).json({ message: "Erreur de mise à jour" });
        }

        res.json({ message: "Profil mis à jour avec succès", user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

router.post('/availability', isAuthenticated, async (req, res) => {
    try {
        const { date, time } = req.body;
        const userId = req.user.id;

        // Ajoutez la logique pour enregistrer la disponibilité dans la base de données

        res.json({ message: "Disponibilité ajoutée avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});



module.exports = router;
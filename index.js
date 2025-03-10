require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db'); // Importer la connexion à MongoDB
const authRoutes = require('./routes/auth.Routes');
const clientRoutes = require('./routes/client.Routes');
const professionnelRoutes = require('./routes/professionnel.Routes');
const adminRoutes = require('./routes/admin.Routes');
const searchRoutes = require('./routes/search.Routes');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 5000;

// Connexion à MongoDB
connectDB();

// Middleware pour parser les requêtes JSON et les données de formulaire
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (CSS, JS, images)
app.use(express.static("public"));

// Routes
app.use("/auth", authRoutes);
app.use("/client", clientRoutes);
app.use("/professionnel", professionnelRoutes);
app.use("/admin", adminRoutes);
app.use("/search", searchRoutes);

// Route de la page d'accueil
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Route pour la page de connexion
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Route pour la page de connexion
app.get('/clients', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'client.html'));
});

// Route pour la page d'inscription
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});
app.get("/professionnel", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'professionnel.html'));
});

// Route pour la page Profile
app.get("/profile", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

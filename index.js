<<<<<<< HEAD
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
=======
require('dotenv').config(); 
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const collection = require('./config');  // Assurez-vous d'avoir bien configuré votre base de données
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

const jwtSecret = 'your_jwt_secret_key';  // Clé secrète pour générer et vérifier les JWT
>>>>>>> f5691eee773ef1842a3355dfd579b889415f3e52

// Route de la page d'accueil
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
<<<<<<< HEAD

});

// Route pour dashboard admin
app.get ('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});
=======
});

// Route pour la page Client
app.get("/Client", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Client.html'));
});
// Route pour la page Professionnel
app.get("/Professionnel", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'professionnel.html'));
});
app.get("/Profile", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get ('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});
app.get("/api/stats", async (req, res) => {
    try {
        const clientCount = await collection.countDocuments({ role: "client" });
        const proCount = await collection.countDocuments({ role: "professionnel" });
        const reservationCount = await collection.countDocuments({ type: "reservation" }); // Vérifie que la collection existe !

        res.json({
            clients: clientCount,
            professionnels: proCount,
            reservations: reservationCount
        });
    } catch (error) {
        console.error("Erreur lors du chargement des statistiques :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});
>>>>>>> f5691eee773ef1842a3355dfd579b889415f3e52

// ✅ Route pour récupérer tous les clients
app.get('/api/clients', async (req, res) => {
    try {
        const clients = await collection.find({ role: 'client' }); // Filtrer uniquement les clients
        res.json(clients);
    } catch (error) {
        console.error('Erreur lors de la récupération des clients:', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
});

// ✅ Route pour supprimer un client par ID
app.delete('/api/clients/:id', async (req, res) => {
    try {
        const clientId = req.params.id;
        const result = await collection.deleteOne({ _id: clientId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Client non trouvé' });
        }

        res.json({ message: 'Client supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du client:', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
});

<<<<<<< HEAD
// Route pour récupérer tous les professionnels
app.get("/api/professionnels", async (req, res) => {
    try {
        const professionnels = await Professionnel.find();
        res.json(professionnels); // ✅ Envoi des données correctement
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des professionnels." });
    }
});

// Supprimer un professionnel
app.delete("/api/professionnels/:id", async (req, res) => {
    try {
        await Professionnel.findByIdAndDelete(req.params.id);
        res.json({ message: "Professionnel supprimé avec succès." });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la suppression du professionnel." });
    }
});


// Route pour la page de connexion
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Route pour la page de connexion
app.get('/clients', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'client.html'));
});
=======
>>>>>>> f5691eee773ef1842a3355dfd579b889415f3e52

// Route pour la page d'inscription
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});
<<<<<<< HEAD
app.get("/professionnel", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'professionnel.html'));
});

// Route pour la page Profile
app.get("/profile", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

// Démarrer le serveur
=======

// Inscription d'un nouvel utilisateur
app.post("/signup", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const data = {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role,
            dateOfBirth: req.body.dateOfBirth,
            status: req.body.status,
            cityAddress: req.body.cityAddress,
            job: req.body.role === 'professionnel' ? req.body.job : null
        };

        if (!['admin', 'client', 'professionnel'].includes(req.body.role)) {
            return res.status(400).send("Rôle invalide !");
        }

        const existingUser = await collection.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(409).send("User already exists");
        } else {
            const userdata = await collection.create(data);
            console.log("Utilisateur enregistré :", userdata);
            res.redirect('/');
        }
    } catch (error) {
        console.error("Erreur d'inscription :", error);
        res.status(500).send("Error registering new user");
    }
});

// Connexion d'un utilisateur et génération du token JWT
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ username: req.body.username });
        if (!check) {
            res.send("User not found");
        } else {
            const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
            if (isPasswordMatch) {
                const token = jwt.sign({ id: check._id, role: check.role }, jwtSecret, { expiresIn: '10d' });
                const decodedToken = jwt.verify(token, jwtSecret);
                const userRole = decodedToken.role;
                let redirectUrl;
                switch (userRole) {
                    case 'admin':
                        redirectUrl = '/admin';
                        break;
                    case 'client':
                        redirectUrl = '/client';
                        break;
                    case 'professionnel':
                        redirectUrl = '/professionnel';
                        break;
                    default:
                        redirectUrl = '/';
                }
                res.status(200).json({ token, redirectUrl });
            } else {
                res.send("Wrong password");
            }
        }
    } catch (error) {
        console.error(error);
        res.send("Error logging in user");
    }
});

// Middleware pour vérifier si l'utilisateur est authentifié
function isAuthenticated(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                return res.status(403).send("Token invalide");
            } else {
                req.user = decoded;
                next();
            }
        });
    } else {
        res.status(403).send("Aucun token fourni, veuillez vous connecter et fournir un token valide");
    }
}

// Middleware pour vérifier si l'utilisateur a un rôle spécifique
function hasRole(role) {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            return next();
        } else {
            res.status(403).send("Access denied");
        }
    };
}

// Route protégée pour l'administrateur
app.get('/admin', isAuthenticated, hasRole('admin'), (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Route protégée pour un client
app.get('/client', isAuthenticated, hasRole('client'), (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'client.html'));
});
app.get('/search-professionals', async (req, res) => {
    const { job } = req.query;

    // Vérifier que le critère de recherche (job) est fourni
    if (!job) {
        return res.status(400).json({ message: 'Veuillez fournir un métier pour la recherche.' });
    }

    // Construire la requête MongoDB
    const query = { 
        role: 'professionnel', // Filtrer par rôle "professionnel"
        job: { $regex: job, $options: 'i' } // Filtrer par métier (insensible à la casse)
    };

    try {
        // Exécuter la requête
        const professionals = await collection.find(query);

        // Vérifier si des résultats ont été trouvés
        if (professionals.length === 0) {
            return res.status(404).json({ message: 'Aucun professionnel trouvé pour ce métier.' });
        }

        // Renvoyer les résultats
        res.json(professionals);
    } catch (error) {
        console.error('Erreur lors de la recherche :', error);
        res.status(500).json({ message: 'Erreur lors de la recherche', error });
    }
});

const port = process.env.PORT || 5000;
>>>>>>> f5691eee773ef1842a3355dfd579b889415f3e52
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

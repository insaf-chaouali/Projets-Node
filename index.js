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

// Route de la page d'accueil
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Route pour la page Client
app.get("/Client", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Client.html'));
});

app.get("/Profile", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

// Route pour la page d'inscription
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

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
                const token = jwt.sign({ id: check._id, role: check.role }, jwtSecret, { expiresIn: '5d' });
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
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Route protégée pour un client
app.get('/client', isAuthenticated, hasRole('client'), (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'client.html'));
});

// Route protégée pour un professionnel
app.get('/professionnel', isAuthenticated, hasRole('professionnel'), (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'professionnel.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

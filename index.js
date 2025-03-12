require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db'); // Importer la connexion à MongoDB
const authRoutes = require('./routes/auth.Routes');
const clientRoutes = require('./routes/client.Routes');
const professionnelRoutes = require('./routes/professionnel.Routes');
const profileRoutes = require('./routes/auth.Routes');
const searchRoutes = require('./routes/search.Routes');
const adminRoutes =require('./routes/admin.Routes');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 5000;

// Connexion à MongoDB
connectDB();

// Middleware pour parser les requêtes JSON et les données de formulaire
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Servir les fichiers statiques (CSS, JS, images)
app.use(express.static("public"));

// Routes
app.use("/auth", authRoutes);
app.use("/client", clientRoutes);
app.use("/professionnel", professionnelRoutes);
app.use("/admin", adminRoutes);
app.use("/search", searchRoutes);
app.use('/auth', profileRoutes);

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
app.get("/admin", (req, res) => {
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


// Socket.io configuration
io.on("connection", (socket) => {
  console.log(`Utilisateur connecté : ${socket.id}`);

  // Recevoir une réservation et la transmettre au professionnel
  socket.on("reservation", (data) => {
    console.log("Nouvelle réservation :", data);
    io.emit("nouvelle_reservation", data); // Envoie à tous les professionnels
  });

  // Gérer la réponse du professionnel (accepté ou refusé)
  socket.on("reponse_professionnel", (data) => {
    console.log("Réponse du professionnel :", data);
    io.emit("maj_rendezvous", data); // Notifie le client de la réponse
  });

  socket.on("disconnect", () => {
    console.log(`Utilisateur déconnecté : ${socket.id}`);
  });
});

// Démarrer le serveur
server.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});

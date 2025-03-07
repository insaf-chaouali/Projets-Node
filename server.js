

const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Données simulées
const stats = {
    clients: 150,
    professionnels: 80,
    reservations: 230,
    clientStats: [10, 20, 30, 40, 50, 60],
    proStats: [5, 15, 25, 35, 45, 55],
    reservationStats: [15, 25, 35, 45, 55, 65]
};

const clients = [
    { id: 1, nom: "Jean Dupont", email: "jean@example.com", adresse: "Paris" },
    { id: 2, nom: "Marie Curie", email: "marie@example.com", adresse: "Lyon" }
];

const professionnels = [
    { id: 1, nom: "Paul Durand", email: "paul@example.com", metier: "Plombier", adresse: "Marseille" },
    { id: 2, nom: "Sophie Bernard", email: "sophie@example.com", metier: "Électricienne", adresse: "Toulouse" }
];

// Routes API
app.get("/api/stats", (req, res) => res.json(stats));
app.get("/api/clients", (req, res) => res.json(clients));
app.get("/api/professionnels", (req, res) => res.json(professionnels));

app.listen(port, () => console.log(`Serveur démarré sur http://localhost:${port}`));

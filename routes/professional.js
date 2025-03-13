const express = require("express");
const Professional = require("../models/Professional");
const router = express.Router();

// Ajouter un compte professionnel
router.post("/create", async (req, res) => {
    try {
        const professional = new Professional(req.body);
        await professional.save();
        res.status(201).send({ message: "Compte professionnel créé avec succès", professional });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Modifier un compte professionnel
router.put("/update/:id", async (req, res) => {
    try {
        const updatedProfessional = await Professional.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProfessional) return res.status(404).send({ message: "Compte non trouvé" });
        res.status(200).send({ message: "Compte mis à jour", updatedProfessional });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Supprimer un compte professionnel
router.delete("/delete/:id", async (req, res) => {
    try {
        const deletedProfessional = await Professional.findByIdAndDelete(req.params.id);
        if (!deletedProfessional) return res.status(404).send({ message: "Compte non trouvé" });
        res.status(200).send({ message: "Compte supprimé avec succès" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Récupérer tous les comptes professionnels
router.get("/all", async (req, res) => {
    try {
        const professionals = await Professional.find();
        res.status(200).send(professionals);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;

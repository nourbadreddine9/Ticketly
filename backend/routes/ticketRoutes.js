const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Ticket = require("../models/Ticket");

// Route de test - À METTRE AVANT les autres routes
router.get("/test-model", async (req, res) => {
  const testTicket = new Ticket({
    id: "test-id-123",
    message: "Test de modèle",
    categorie: "test",
    ownerName: "Test User",
    ownerTel: "0600000000",
    status: "pending",
    code: "TEST001",
    response: "Ceci est un test"
  });

  try {
    await testTicket.save();
    res.json({ message: "Test ticket saved", ticket: testTicket });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ajouter un ticket
router.post("/", async (req, res) => {
  try {
    const ticket = new Ticket(req.body);
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Lire tous les tickets
router.get("/", async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// GET single ticket - Version corrigée

/*router.get("/:id", async (req, res) => {
  try {
    // Vérifiez d'abord que l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID de ticket invalide" });
    }

    const ticket = await Ticket.findOne({ 
      $or: [
        { _id: req.params.id },
        { id: req.params.id } // Au cas où vous cherchiez par l'ID secondaire
      ]
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket non trouvé" });
    }

    res.json(ticket);
  } catch (error) {
    console.error("Erreur backend:", error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});*/
router.get("/:id", async (req, res) => {
  try {
    let ticket;
    
    // Essayer de trouver par _id (ObjectId) d'abord
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      ticket = await Ticket.findById(req.params.id);
    }
    
    // Si pas trouvé, essayer par le champ id
    if (!ticket) {
      ticket = await Ticket.findOne({ id: req.params.id });
    }

    if (!ticket) {
      return res.status(404).json({ message: "Ticket non trouvé" });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});
  
module.exports = router;
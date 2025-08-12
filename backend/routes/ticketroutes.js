const express = require("express");
const router = express.Router();
const Ticket = require("../models/ticket");
const { v4: uuidv4 } = require("uuid");

// ✅ POST - Créer un nouveau ticket
router.post("/", async (req, res) => {
  try {
    const ticket = new Ticket({
      id: uuidv4(),
      message: req.body.message,
      categorie: req.body.categorie,
      ownerName: req.body.ownerName,
      ownerTel: req.body.ownerTel,
      statut: req.body.statut || "en attente", // ✅ ici c'est "statut" pas "status"
      priorite: req.body.priorite || "medium",
      resolver: req.body.resolver || null,
      code: req.body.code || "",
      response: req.body.response || "",
      created_at: new Date(),
    });

    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    console.error("❌ Erreur création ticket:", error);
    res.status(400).json({ error: error.message });
  }
});

// ✅ GET - Tous les tickets
router.get("/", async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ created_at: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET - Ticket par ID (Mongo ID, pas le champ id personnalisé)
router.get("/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket non trouvé" });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ PATCH - Mise à jour d’un ticket (statut, réponse, etc.)
router.patch("/:id", async (req, res) => {
  try {
    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedTicket) return res.status(404).json({ error: "Ticket non trouvé" });

    res.json(updatedTicket);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la mise à jour du ticket" });
  }
});

// ✅ GET - Statistiques générales
router.get("/stats/all", async (req, res) => {
  try {
    const all = await Ticket.find();
    const resolved = all.filter(t => t.statut === "résolu");
    const avgRating =
      all.length > 0
        ? all.reduce((acc, t) => acc + (t.rating || 4.5), 0) / all.length
        : 0;

    res.json({
      total: all.length,
      resolved: resolved.length,
      averageRating: avgRating.toFixed(1),
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur récupération stats" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Ticket = require("../models/Ticket");

// Obtenir les détails d'un client et ses tickets
router.get("/:id", async (req, res) => {
  try {
    // Trouver tous les tickets du client
    const tickets = await Ticket.find({ ownerTel: req.params.id }).sort({ created_at: -1 });
    
    if (tickets.length === 0) {
      return res.status(404).json({ message: "Aucun ticket trouvé pour ce client" });
    }

    // Calculer les statistiques
    const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
    const resolutionRate = Math.round((resolvedTickets / tickets.length) * 100);
    const avgSatisfaction = tickets.length > 0 
      ? tickets.reduce((sum, t) => sum + (t.satisfaction || 0), 0) / tickets.length
      : 0;

    // Créer l'objet client
    const client = {
      id: req.params.id,
      name: tickets[0].ownerName,
      phone: tickets[0].ownerTel,
      email: tickets[0].email || `${tickets[0].ownerName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      totalTickets: tickets.length,
      resolvedTickets,
      resolutionRate,
      averageSatisfaction: parseFloat(avgSatisfaction.toFixed(1)),
      joinDate: tickets[tickets.length - 1].created_at, // Premier ticket
      lastActivity: tickets[0].created_at, // Dernier ticket
      tickets: tickets.map(t => ({
        id: t._id,
        subject: t.message.split('\n')[0] || 'Sans objet',
        message: t.message,
        category: t.categorie,
        status: t.status,
        createdAt: t.created_at,
        resolvedAt: t.resolvedAt,
        satisfaction: t.satisfaction
      }))
    };

    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
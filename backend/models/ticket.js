const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  id: String,
  message: String,
  categorie: String,
  ownerName: String,
  ownerTel: String,
  status: String,
  priorite: String,
  resolver: String,
  response: String,
  code: String,
  created_at: Date,
});

module.exports = mongoose.model("Ticket", ticketSchema);

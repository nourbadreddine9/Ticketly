/*const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  client: String,
  message: String,
  statut: String,
  categorie: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Ticket", ticketSchema);*/

/*const ticketSchema = new mongoose.Schema({
  id: String,
  message: String,
  categorie: String,
  ownerName: String,
  ownerTel: String,
  status: String,
  resolver: String,
  code: String,
  response: String,
  created_at: Date
});*/
const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  id: { type: String, required: true },
  message: { type: String, required: true },
  categorie: { type: String, required: true },
  ownerName: { type: String, required: true },
  ownerTel: { type: String, required: true },
  status: { type: String, required: true },
  resolver: { type: String, default: null },
  code: { type: String, required: true },
  response: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Ticket", ticketSchema, "tickets");

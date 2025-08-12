/*const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const ticketRoutes = require("./routes/ticketRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/tickets", ticketRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(5000, () => console.log("🚀 Server running on port 5000"));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));*/

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const ticketRoutes = require("./routes/ticketRoutes");

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // Autorise uniquement votre front Next.js
  methods: ['GET', 'POST', 'PUT', 'DELETE'] // Ajoutez les méthodes nécessaires
}));
app.use(express.json());

app.use("/api/tickets", ticketRoutes);

/*** AJOUT CRITIQUE ICI ***/
// Middleware de logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://nourbadreddine999:5AlR9ukHPEc2QcQE@cluster0.mongodb.net/support_tickets?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "support_tickets" // Spécifie explicitement la base de données
})
.then(() => {
  console.log("✅ Connected to MongoDB (ClusterOnnongoShowet/support_tickets)");
  app.listen(5000, () => console.log("🚀 Server running on port 5000"));
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1); // Quitte l'application en cas d'échec
});

// Ajoutez cette ligne après les autres routes
const clientRoutes = require("./routes/clientRoutes");
app.use("/api/clients", clientRoutes);
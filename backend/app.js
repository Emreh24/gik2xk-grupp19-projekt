// app.js - Huvudfil för backend-servern
// Här kopplas allt ihop: middlewares, routes och databasuppstart

const express = require("express");
const cors = require("cors");
const { sequelize, User } = require("./models");

// Importerar de tre route-filerna som hanterar produkter, användare och varukorg
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();
const PORT = 3001;

// Tillåter anrop från frontend (React) och tolkar JSON i request-bodyn
app.use(cors());
app.use(express.json());

// Kopplar route-filerna till sina respektive URL-prefix
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);

// Synkroniserar databasen med modellerna och startar sedan servern
// force: false betyder att befintliga tabeller inte skrivs över vid omstart
sequelize.sync({ force: false }).then(async () => {
  console.log("✅ Databas synkroniserad");

  // Skapar en standardanvändare med id 1 om den inte redan finns
  // Denna används som den hårdkodade kunden i applikationen
  await User.findOrCreate({
    where: { id: 1 },
    defaults: {
      first_name: "Kund",
      last_name: "Användare",
      email: "kund@game19.se",
      password: "123456",
    },
  });
  console.log("✅ Standardanvändare finns");

  app.listen(PORT, () => {
    console.log(`🚀 Server körs på http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("❌ Fel vid databassynkronisering:", err);
});
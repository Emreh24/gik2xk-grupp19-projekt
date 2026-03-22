// app.js - Huvudfil för backend-servern
const express = require("express");
const cors = require("cors");
const { sequelize, User } = require("./models");

const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);

sequelize.sync({ force: false }).then(async () => {
  console.log("✅ Databas synkroniserad");

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
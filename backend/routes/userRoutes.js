// Importerar express och skapar en router
const express = require("express");
const router = express.Router();

// Importerar userService (logiken för användare)
const userService = require("../services/userService");

// Hämtar alla användare
router.get("/", async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Kunde inte hämta användare" });
  }
});

// Hämtar en specifik användare via ID
router.get("/:id", async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);

    // Om användaren inte finns
    if (!user) return res.status(404).json({ error: "Användaren hittades inte" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Kunde inte hämta användare" });
  }
});

// Hämtar användarens varukorg
router.get("/:id/getCart", async (req, res) => {
  try {
    const cart = await userService.getUserCart(req.params.id);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Kunde inte hämta varukorg" });
  }
});

// Skapar en ny användare
router.post("/", async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: "Kunde inte skapa användare" });
  }
});

// Uppdaterar en användare
router.put("/:id", async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);

    // Om användaren inte finns
    if (!user) return res.status(404).json({ error: "Användaren hittades inte" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Kunde inte uppdatera användare" });
  }
});

// Tar bort en användare
router.delete("/:id", async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.id);

    // Om användaren inte finns
    if (!result) return res.status(404).json({ error: "Användaren hittades inte" });

    res.json({ message: "Användaren har tagits bort" });
  } catch (err) {
    res.status(500).json({ error: "Kunde inte ta bort användare" });
  }
});

// Exporterar routern
module.exports = router;
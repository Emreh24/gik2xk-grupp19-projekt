// routes/userRoutes.js - API-endpoints för användare
const express = require("express");
const router = express.Router();
const userService = require("../services/userService");

router.get("/", async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Kunde inte hämta användare" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "Användaren hittades inte" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Kunde inte hämta användare" });
  }
});

router.get("/:id/getCart", async (req, res) => {
  try {
    const cart = await userService.getUserCart(req.params.id);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Kunde inte hämta varukorg" });
  }
});

router.post("/", async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: "Kunde inte skapa användare" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ error: "Användaren hittades inte" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Kunde inte uppdatera användare" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    if (!result) return res.status(404).json({ error: "Användaren hittades inte" });
    res.json({ message: "Användaren har tagits bort" });
  } catch (err) {
    res.status(500).json({ error: "Kunde inte ta bort användare" });
  }
});

module.exports = router;

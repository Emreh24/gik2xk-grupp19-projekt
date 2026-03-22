// routes/cartRoutes.js - API-endpoints för varukorg
const express = require("express");
const router = express.Router();
const cartService = require("../services/cartService");

// Lägg till produkt i varukorg
router.post("/addProduct", async (req, res) => {
  try {
    const { userId, productId, amount } = req.body;
    if (!userId || !productId || !amount) {
      return res.status(400).json({ error: "userId, productId och amount krävs" });
    }
    const result = await cartService.addProductToCart(userId, productId, amount);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: "Kunde inte lägga till i varukorg" });
  }
});

// Uppdatera antal för en rad i varukorgen
router.put("/item/:cartRowId", async (req, res) => {
  try {
    const { amount } = req.body;
    const result = await cartService.updateCartItem(req.params.cartRowId, amount);
    if (!result) return res.status(404).json({ error: "Raden hittades inte" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Kunde inte uppdatera varukorgen" });
  }
});

// Ta bort en rad från varukorgen
router.delete("/item/:cartRowId", async (req, res) => {
  try {
    const result = await cartService.removeCartItem(req.params.cartRowId);
    if (!result) return res.status(404).json({ error: "Raden hittades inte" });
    res.json({ message: "Produkten togs bort från varukorgen" });
  } catch (err) {
    res.status(500).json({ error: "Kunde inte ta bort från varukorgen" });
  }
});

module.exports = router;
// routes/productRoutes.js - API-endpoints för produkter med rabatt och plattformar
const express = require("express");
const router = express.Router();
const productService = require("../services/productService");

router.get("/", async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Kunde inte hämta produkter" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: "Produkten hittades inte" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Kunde inte hämta produkt" });
  }
});

router.post("/", async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: "Kunde inte skapa produkt" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    if (!product) return res.status(404).json({ error: "Produkten hittades inte" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Kunde inte uppdatera produkt" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    if (!result) return res.status(404).json({ error: "Produkten hittades inte" });
    res.json({ message: "Produkten har tagits bort" });
  } catch (err) {
    res.status(500).json({ error: "Kunde inte ta bort produkt" });
  }
});

router.post("/:id/rating", async (req, res) => {
  try {
    const { rating } = req.body;
    const result = await productService.addRating(req.params.id, rating);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: "Kunde inte lägga till betyg" });
  }
});

module.exports = router;

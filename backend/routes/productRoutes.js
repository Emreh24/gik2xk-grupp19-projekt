// Importerar express och skapar en router
const express = require("express");
const router = express.Router();

// Importerar productService som innehåller logiken
const productService = require("../services/productService");

// Hämtar alla produkter
router.get("/", async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Kunde inte hämta produkter" });
  }
});

// Hämtar en specifik produkt via ID
router.get("/:id", async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);

    // Om produkten inte finns
    if (!product) return res.status(404).json({ error: "Produkten hittades inte" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Kunde inte hämta produkt" });
  }
});

// Skapar en ny produkt
router.post("/", async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: "Kunde inte skapa produkt" });
  }
});

// Uppdaterar en produkt
router.put("/:id", async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);

    // Om produkten inte finns
    if (!product) return res.status(404).json({ error: "Produkten hittades inte" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Kunde inte uppdatera produkt" });
  }
});

// Tar bort en produkt
router.delete("/:id", async (req, res) => {
  try {
    const result = await productService.deleteProduct(req.params.id);

    // Om produkten inte finns
    if (!result) return res.status(404).json({ error: "Produkten hittades inte" });

    res.json({ message: "Produkten har tagits bort" });
  } catch (err) {
    res.status(500).json({ error: "Kunde inte ta bort produkt" });
  }
});

// Lägger till betyg på en produkt
router.post("/:id/rating", async (req, res) => {
  try {
    const { rating } = req.body;

    const result = await productService.addRating(req.params.id, rating);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: "Kunde inte lägga till betyg" });
  }
});

// Exporterar routern
module.exports = router;
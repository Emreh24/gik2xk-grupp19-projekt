// services/productService.js - Affärslogik för produkter med rabatt, plattformar och genrer
const { Product, Rating } = require("../models");

const getAllProducts = async () => {
  const products = await Product.findAll({ include: [{ model: Rating }] });
  return products.map((p) => _cleanProduct(p));
};

const getProductById = async (id) => {
  const product = await Product.findByPk(id, { include: [{ model: Rating }] });
  if (!product) return null;
  return _cleanProduct(product);
};

const createProduct = async (data) => {
  if (Array.isArray(data.platforms)) {
    data.platforms = JSON.stringify(data.platforms);
  }
  if (Array.isArray(data.genres)) {
    data.genre = data.genres[0] || "";
    data.genres = JSON.stringify(data.genres);
  } else if (typeof data.genres === "string" && data.genres.startsWith("[")) {
    const parsed = JSON.parse(data.genres);
    data.genre = parsed[0] || "";
  }
  return await Product.create(data);
};

const updateProduct = async (id, data) => {
  const product = await Product.findByPk(id);
  if (!product) return null;
  if (Array.isArray(data.platforms)) {
    data.platforms = JSON.stringify(data.platforms);
  }
  if (Array.isArray(data.genres)) {
    data.genre = data.genres[0] || "";
    data.genres = JSON.stringify(data.genres);
  } else if (typeof data.genres === "string" && data.genres.startsWith("[")) {
    const parsed = JSON.parse(data.genres);
    data.genre = parsed[0] || "";
  }
  return await product.update(data);
};

const deleteProduct = async (id) => {
  const product = await Product.findByPk(id);
  if (!product) return null;
  await product.destroy();
  return true;
};

const addRating = async (productId, rating) => {
  return await Rating.create({ product_id: productId, rating });
};

// Städar upp produktdata och beräknar rabatt
const _cleanProduct = (product) => {
  const ratings = product.Ratings || [];
  const avgRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

  const discountPercent = product.discountPercent || 0;
  const originalPrice = product.price;
  const discountedPrice = discountPercent > 0
    ? Math.round(originalPrice * (1 - discountPercent / 100))
    : originalPrice;

  // Parsar plattformar från JSON-sträng till array
  let platforms = [];
  try {
    platforms = JSON.parse(product.platforms || "[]");
  } catch {
    platforms = [];
  }

  // Parsar genrer från JSON-sträng till array
  let genres = [];
  try {
    genres = JSON.parse(product.genres || "[]");
  } catch {
    genres = [];
  }

  // Om genres är tom men genre finns, använd genre
  if (genres.length === 0 && product.genre) {
    genres = [product.genre];
  }

  return {
    id: product.id,
    title: product.title,
    description: product.description,
    originalPrice,
    discountedPrice,
    discountPercent,
    imageUrl: product.imageUrl,
    genre: genres[0] || product.genre || "",
    genres,
    platforms,
    ratings: ratings.map((r) => ({ id: r.id, rating: r.rating })),
    avgRating: Math.round(avgRating * 10) / 10,
  };
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addRating,
};
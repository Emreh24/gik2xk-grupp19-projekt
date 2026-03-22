// src/services/api.js - All API-kommunikation med backend
import axios from "axios";

const BASE_URL = "/api";

// Produkter
export const getProducts = () => axios.get(`${BASE_URL}/products`);
export const getProduct = (id) => axios.get(`${BASE_URL}/products/${id}`);
export const createProduct = (data) => axios.post(`${BASE_URL}/products`, data);
export const updateProduct = (id, data) => axios.put(`${BASE_URL}/products/${id}`, data);
export const deleteProduct = (id) => axios.delete(`${BASE_URL}/products/${id}`);
export const addRating = (productId, rating) =>
  axios.post(`${BASE_URL}/products/${productId}/rating`, { rating });

// Varukorg
export const addToCart = (userId, productId, amount) =>
  axios.post(`${BASE_URL}/cart/addProduct`, { userId, productId, amount });
export const getCart = (userId) =>
  axios.get(`${BASE_URL}/users/${userId}/getCart`);
export const updateCartItem = (cartRowId, amount) =>
  axios.put(`${BASE_URL}/cart/item/${cartRowId}`, { amount });
export const removeCartItem = (cartRowId) =>
  axios.delete(`${BASE_URL}/cart/item/${cartRowId}`);

// Användare
export const getUsers = () => axios.get(`${BASE_URL}/users`);
export const createUser = (data) => axios.post(`${BASE_URL}/users`, data);
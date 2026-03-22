// services/cartService.js - Varukorg med ändra antal och ta bort
const { Cart, CartRow, Product } = require("../models");

const addProductToCart = async (userId, productId, amount) => {
  const [cart] = await Cart.findOrCreate({
    where: { user_id: userId, paid: false },
    defaults: { user_id: userId, paid: false },
  });

  const existingRow = await CartRow.findOne({
    where: { cart_id: cart.id, product_id: productId },
  });

  if (existingRow) {
    await existingRow.update({ amount: existingRow.amount + amount });
    return existingRow;
  } else {
    return await CartRow.create({
      cart_id: cart.id,
      product_id: productId,
      amount,
    });
  }
};

// Uppdaterar antal för en specifik rad i varukorgen
const updateCartItem = async (cartRowId, amount) => {
  const row = await CartRow.findByPk(cartRowId);
  if (!row) return null;
  if (amount <= 0) {
    await row.destroy();
    return { deleted: true };
  }
  return await row.update({ amount });
};

// Tar bort en specifik produkt från varukorgen
const removeCartItem = async (cartRowId) => {
  const row = await CartRow.findByPk(cartRowId);
  if (!row) return null;
  await row.destroy();
  return { deleted: true };
};

const getCartByUserId = async (userId) => {
  const cart = await Cart.findOne({
    where: { user_id: userId, paid: false },
    include: [
      {
        model: CartRow,
        include: [{ model: Product }],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  if (!cart) return { items: [], total: 0 };

  const items = cart.CartRows.map((row) => {
    const discountPercent = row.Product.discountPercent || 0;
    const originalPrice = row.Product.price;
    const discountedPrice = discountPercent > 0
      ? Math.round(originalPrice * (1 - discountPercent / 100))
      : originalPrice;

    return {
      cartRowId: row.id,
      productId: row.Product.id,
      title: row.Product.title,
      originalPrice,
      discountedPrice,
      discountPercent,
      imageUrl: row.Product.imageUrl,
      amount: row.amount,
      subtotal: discountedPrice * row.amount,
    };
  });

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  return { cartId: cart.id, items, total };
};

module.exports = { addProductToCart, updateCartItem, removeCartItem, getCartByUserId };
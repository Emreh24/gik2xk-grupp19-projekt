// Hämtar modellerna som används i varukorgen
const { Cart, CartRow, Product } = require("../models");

// Lägger till en produkt i användarens varukorg
const addProductToCart = async (userId, productId, amount) => {
  // Hämtar en aktiv varukorg, eller skapar en ny om den inte finns
  const [cart] = await Cart.findOrCreate({
    where: { user_id: userId, paid: false },
    defaults: { user_id: userId, paid: false },
  });

  // Kollar om produkten redan finns i varukorgen
  const existingRow = await CartRow.findOne({
    where: { cart_id: cart.id, product_id: productId },
  });

  // Om produkten redan finns, uppdateras antalet
  if (existingRow) {
    await existingRow.update({ amount: existingRow.amount + amount });
    return existingRow;
  } else {
    // Annars skapas en ny rad i varukorgen
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

  // Om raden inte finns returneras null
  if (!row) return null;

  // Om antal är 0 eller mindre tas raden bort
  if (amount <= 0) {
    await row.destroy();
    return { deleted: true };
  }

  // Annars uppdateras antalet
  return await row.update({ amount });
};

// Tar bort en specifik produkt från varukorgen
const removeCartItem = async (cartRowId) => {
  const row = await CartRow.findByPk(cartRowId);

  // Om raden inte finns returneras null
  if (!row) return null;

  // Tar bort raden från varukorgen
  await row.destroy();
  return { deleted: true };
};

// Hämtar användarens aktiva varukorg
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

  // Om ingen varukorg finns returneras tom lista och total 0
  if (!cart) return { items: [], total: 0 };

  // Bygger upp en lista med produkter i varukorgen
  const items = cart.CartRows.map((row) => {
    const discountPercent = row.Product.discountPercent || 0;
    const originalPrice = row.Product.price;

    // Räknar ut rabatterat pris om rabatt finns
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
      subtotal: discountedPrice * row.amount, // totalsumma för den raden
    };
  });

  // Räknar ut hela varukorgens totalsumma
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  return { cartId: cart.id, items, total };
};

// Exporterar funktionerna så de kan användas i andra filer
module.exports = { addProductToCart, updateCartItem, removeCartItem, getCartByUserId };
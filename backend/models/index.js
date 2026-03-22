// models/index.js - Databasanslutning och relationer mellan tabeller
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: false,
});

const User = require("./user")(sequelize);
const Product = require("./product")(sequelize);
const Rating = require("./rating")(sequelize);
const Cart = require("./cart")(sequelize);
const CartRow = require("./cartRow")(sequelize);

// Relationer
User.hasMany(Cart, { foreignKey: "user_id" });
Cart.belongsTo(User, { foreignKey: "user_id" });

Product.hasMany(Rating, { foreignKey: "product_id" });
Rating.belongsTo(Product, { foreignKey: "product_id" });

Cart.belongsToMany(Product, { through: CartRow, foreignKey: "cart_id" });
Product.belongsToMany(Cart, { through: CartRow, foreignKey: "product_id" });

CartRow.belongsTo(Product, { foreignKey: "product_id" });
CartRow.belongsTo(Cart, { foreignKey: "cart_id" });
Cart.hasMany(CartRow, { foreignKey: "cart_id" });

module.exports = { sequelize, User, Product, Rating, Cart, CartRow };
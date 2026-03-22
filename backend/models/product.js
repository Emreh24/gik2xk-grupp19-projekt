// models/product.js - Produkt med rabatt, flera plattformar och flera genrer
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Product = sequelize.define("Product", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    discountPercent: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    genre: {
      // Behålls för bakåtkompatibilitet
      type: DataTypes.STRING,
      allowNull: true,
    },
    genres: {
      // Sparas som JSON-sträng t.ex. '["Action","Sport"]'
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "[]",
    },
    platforms: {
      // Sparas som JSON-sträng t.ex. '["PC","PlayStation 5"]'
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "[]",
    },
  }, {
    tableName: "products",
  });

  return Product;
};
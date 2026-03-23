// Importerar DataTypes från Sequelize
const { DataTypes } = require("sequelize");

// Exporterar modellen
module.exports = (sequelize) => {

  // Skapar CartRow-modellen (koppling mellan cart och product)
  const CartRow = sequelize.define("CartRow", {

    // ID för varje rad i varukorgen
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // Antal av produkten i varukorgen
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 1, // standard är 1 st
    },

    // Koppling till produkt
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // Koppling till varukorg
    cart_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

  }, {
    tableName: "cart_rows", // namn på tabellen i databasen
  });

  return CartRow;
};
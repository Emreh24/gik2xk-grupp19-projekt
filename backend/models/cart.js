// Importerar DataTypes från Sequelize
const { DataTypes } = require("sequelize");

// Exporterar modellen
module.exports = (sequelize) => {

  // Skapar Cart-modellen
  const Cart = sequelize.define("Cart", {

    // ID för varje varukorg
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // Visar om varukorgen är betald eller inte
    paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // standard är obetald
    },

    // Koppling till användaren som äger varukorgen
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

  }, {
    tableName: "carts", // namn på tabellen i databasen
  });

  return Cart;
};
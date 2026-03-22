// models/cartRow.js - Kopplingstabellen mellan Cart och Product
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const CartRow = sequelize.define("CartRow", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 1,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cart_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: "cart_rows",
  });

  return CartRow;
};
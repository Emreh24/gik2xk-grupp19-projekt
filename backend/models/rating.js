// models/rating.js - Modell för produktbetyg
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Rating = sequelize.define("Rating", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rating: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: "ratings",
  });

  return Rating;
};

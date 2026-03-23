// Importerar DataTypes från Sequelize
const { DataTypes } = require("sequelize");

// Exporterar modellen
module.exports = (sequelize) => {

  // Skapar Rating-modellen
  const Rating = sequelize.define("Rating", {

    // ID för varje betyg
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // Själva betyget (t.ex. 1–5)
    rating: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },

    // Koppling till produkten som betygsätts
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

  }, {
    tableName: "ratings", // namn på tabellen i databasen
  });

  return Rating;
};
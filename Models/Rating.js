const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Rating = sequelize.define(
  "avaliacao",
  {
    idAvaliacao: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    descricao: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    nota: {
      type: Sequelize.DOUBLE(20),
      allowNull: false,
    },
    dataAvaliacao: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = Rating;

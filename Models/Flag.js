const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const User = sequelize.define(
  "bandeira",
  {
    idBandeira: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    nome: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    unidade: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = User;

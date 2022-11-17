const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Admin = sequelize.define(
  "administrador",
  {
    idAdministrador: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    dataNasc: {
      type: Sequelize.DATE,
      required: true,
    },
    nome: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    telefone: {
      type: Sequelize.STRING(11),
      allowNull: false,
    },
    cpf: {
      type: Sequelize.STRING(11),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = Admin;

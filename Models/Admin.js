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
    cpf: {
      type: Sequelize.STRING(11),
      required: true,
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
    urlImagem: {
      type: Sequelize.STRING(255),
    },
  },
  {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = Admin;

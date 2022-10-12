const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const User = sequelize.define(
  "usuario",
  {
    idUsuario: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    nome: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    adm: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    telefone: {
      type: Sequelize.STRING(11),
      allowNull: false,
    },
    senha: {
      type: Sequelize.STRING(255),
      required: true,
    },
  },
  {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = User;

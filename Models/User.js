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
    email: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    senha: {
      type: Sequelize.STRING(255),
      required: true,
    },
    isAtivo: {
      type: Sequelize.BOOLEAN,
      required: true,
    },
    codigoVerificacao: {
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

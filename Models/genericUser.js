const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Fuel = sequelize.define(
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
    endereco: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    bairro: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    cidade: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    cep: {
      type: Sequelize.STRING(8),
      allowNull: false,
    },
    uf: {
      type: Sequelize.STRING(2),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    telefone: {
      type: Sequelize.STRING(11),
      allowNull: false,
    },
    senha: {
      type: Sequelize.STRING,
      required: true,
    },
  },
  {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = Fuel;

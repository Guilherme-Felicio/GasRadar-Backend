const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const User = sequelize.define(
  "estabelecimento",
  {
    idEstabelecimento: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    status: {
      type: Sequelize.STRING(20),
      required: true,
    },
    endereco: {
      type: Sequelize.STRING(50),
      required: true,
    },
    cidade: {
      type: Sequelize.STRING(50),
      required: true,
    },
    bairro: {
      type: Sequelize.STRING(30),
      required: true,
    },
    cep: {
      type: Sequelize.STRING(8),
      required: true,
    },
    uf: {
      type: Sequelize.STRING(2),
      required: true,
    },
    coordenadas: {
      type: Sequelize.STRING(255),
      required: true,
    },
    nota: {
      type: Sequelize.FLOAT(255),
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
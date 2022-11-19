const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Consumer = sequelize.define(
  "consumidor",
  {
    idConsumidor: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    cpf: {
      type: Sequelize.STRING(11),
      required: true,
    },
    genero: {
      type: Sequelize.STRING(15),
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
    cep: {
      type: Sequelize.STRING(8),
      required: true,
    },
    endereco: {
      type: Sequelize.STRING(50),
      required: true,
    },
    numero: {
      type: Sequelize.STRING(20),
      required: true,
    },
    bairro: {
      type: Sequelize.STRING(30),
      required: true,
    },
    cidade: {
      type: Sequelize.STRING(50),
      required: true,
    },
    uf: {
      type: Sequelize.STRING(2),
      required: true,
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

module.exports = Consumer;

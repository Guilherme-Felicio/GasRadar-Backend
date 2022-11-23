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
    endereco: {
      type: Sequelize.STRING(50),
      required: true,
    },
    bairro: {
      type: Sequelize.STRING(30),
      required: true,
    },
    numero: {
      type: Sequelize.STRING(20),
      required: true,
    },
    cidade: {
      type: Sequelize.STRING(50),
      required: true,
    },
    cep: {
      type: Sequelize.STRING(8),
      required: true,
    },
    nota: {
      type: Sequelize.FLOAT(12),
    },
    latitude: {
      type: Sequelize.STRING(11),
    },
    longitude: {
      type: Sequelize.STRING(11),
    },
    urlImagem: {
      type: Sequelize.STRING(255),
    },
    nome: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    telefone: {
      type: Sequelize.STRING(11),
      allowNull: false,
    },
    cnpj: {
      type: Sequelize.STRING(14),
      required: true,
    },
    uf: {
      type: Sequelize.STRING(2),
      required: true,
    },
    status: {
      type: Sequelize.STRING(20),
      required: true,
    },
    horarioAbertura: {
      type: Sequelize.STRING(50),
      required: true,
    },
    horarioEncerramento: {
      type: Sequelize.STRING(50),
      required: true,
    },

    dataTerminoPenalidade: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    dataFundacao: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = User;

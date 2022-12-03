const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const EstablishmentFuel = sequelize.define(
  "estabelecimentoCombustivel",
  {
    idEstabelecimentoCombustivel: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    dataAtualizacao: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    quantidade: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },

    preco: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = EstablishmentFuel;

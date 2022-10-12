const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const User = sequelize.define(
  "estabelecimentocombustivel",
  {
    idEstabelecimentoCombustivel: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    idEstabelecimento: {
      type: Sequelize.INTEGER,
      references: {
        model: "estabelecimento",
        key: "id",
      },
    },
    idCombustivel: {
      type: Sequelize.INTEGER,
      references: {
        model: "combustivel",
        key: "id",
      },
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

module.exports = User;

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
    sexo: {
      type: Sequelize.STRING(15),
      required: true,
    },
    dataNasc: {
      type: Sequelize.DATE,
      required: true,
    },
  },
  {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = Consumer;

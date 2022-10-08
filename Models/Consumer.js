const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Consumer = sequelize.define("consumidor", {
  idConsumidor: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  idUsuario: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      // User belongsTo Company 1:1
      model: "usuario",
      key: "idUsuario",
    },
  },
  cpf: {
    type: Sequelize.STRING(11),
    required: true,
  },
  genero: {
    type: Sequelize.CHAR(1),
    required: true,
  },
  dataNasc: {
    type: Sequelize.DATE,
    required: true,
  },
});

module.exports = Fuel;

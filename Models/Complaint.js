const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Complaint = sequelize.define(
  "denuncia",
  {
    idDenuncia: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    motivo: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    descricao: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    dataDenuncia: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = Complaint;

const Sequelize = require("sequelize");

const sequelize = new Sequelize("gasradar", "root", "abacaxiX123", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;

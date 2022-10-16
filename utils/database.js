const Sequelize = require("sequelize");

const sequelize = new Sequelize("gasradar", "root", "gasradarapi", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;

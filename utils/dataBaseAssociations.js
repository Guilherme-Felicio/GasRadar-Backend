const User = require("../Models/User");
const sequelize = require("../utils/database");

const Consumer = require("../Models/Consumer");
const Establishment = require("../Models/Establishment");
const Flag = require("../Models/Flag");
const Fuel = require("../Models/Fuel");
const Establishment_Fuel = require("../Models/Establishment_Fuel");

const associations = () => {
  // User - Consumer 1:1
  Consumer.belongsTo(User, {
    foreignKey: {
      name: "idUsuario",
      allowNull: false,
    },
  });
  User.hasOne(Consumer);

  // User - Establishment 1:1
  Establishment.belongsTo(User, {
    foreignKey: {
      name: "idEstabelecimento",
      allowNull: false,
    },
  });
  User.hasOne(Establishment);

  // Flag - Establishment 1:N
  Establishment.hasMany(Flag);
  Flag.belongsTo(Establishment);

  // Fuel - Establishment N:N
  Fuel.belongsToMany(Establishment, {
    through: Establishment_Fuel,
    foreignKey: "idCombustivel",
  });
  Establishment.belongsToMany(Fuel, {
    through: Establishment_Fuel,
    foreignKey: "idEstabelecimento",
  });
};

module.exports = associations;

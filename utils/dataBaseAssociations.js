const User = require("../Models/User");
const sequelize = require("../utils/database");

const Consumer = require("../Models/Consumer");
const Establishment = require("../Models/Establishment");
const Flag = require("../Models/Flag");
const Fuel = require("../Models/Fuel");
const Rating = require("../Models/Rating");
const Establishment_Fuel = require("../Models/Establishment_Fuel");

const associations = () => {
  // User - Consumer 1:1
  Consumer.belongsTo(User, {
    onDelete: "CASCADE",
    foreignKey: {
      name: "idUsuario",
      allowNull: false,
    },
  });

  // User - Establishment 1:1

  User.hasOne(Establishment, {
    hooks: true,
    onDelete: "CASCADE",
    foreignKey: {
      name: "idUsuario",
    },
  });
  Establishment.belongsTo(User, {
    onDelete: "CASCADE",
    foreignKey: {
      name: "idUsuario",
    },
  });

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

// Rating - Establishment 1:N
Establishment.hasMany(Rating, {
  foreignKey: "idEstabelecimento",
});

// Rating - Consumer 1:N
Consumer.hasMany(Rating, {
  foreignKey: "idConsumidor",
});

module.exports = associations;

const User = require("../Models/User");
const sequelize = require("../utils/database");

const Consumer = require("../Models/Consumer");
const Establishment = require("../Models/Establishment");
const Flag = require("../Models/Flag");
const Fuel = require("../Models/Fuel");
const Rating = require("../Models/Rating");
const Establishment_Fuel = require("../Models/Establishment_Fuel");
const Admin = require("../Models/Admin");
const Complaint = require("../Models/Complaint");

const associations = () => {
  // User - Consumer 1:N
  Consumer.belongsTo(User, {
    onDelete: "CASCADE",
    foreignKey: {
      name: "idUsuario",
      allowNull: false,
    },
  });

  // User - Establishment 1:N

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

//  Consumer - Complaint 1:N
Consumer.hasMany(Complaint, {
  foreignKey: "idConsumidor",
});

//  Establishment - Complaint 1:N
Establishment.hasMany(Complaint, {
  foreignKey: "idEstabelecimento",
});

//  Admin - Complaint 1:N
Admin.hasMany(Complaint, {
  foreignKey: "idAdministrador",
});

module.exports = associations;

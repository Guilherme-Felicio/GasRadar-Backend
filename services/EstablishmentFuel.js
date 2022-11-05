const sequelize = require("../utils/database");
const { QueryTypes } = require("sequelize");
const EstablishmentFuel = require("../Models/Establishment_Fuel");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { validationResult } = require("express-validator");

// Adicionar um combustivel ao estabelecimento
exports.addFuelToEstablishment = (req, res, next) => {
  // #swagger.tags = ['EstabelecimentoCombustivel']
  // #swagger.description = 'Endpoint para adicionar um combustivel a um estabelecimento. Precisa de autorização'
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Parameters validation failed",
      errors: errors.array(),
    });
  }

  const quantidade = req.body.quantidade;
  const preco = req.body.preco;
  const idCombustivel = req.body.idCombustivel;
  const idEstabelecimento = req.body.idEstabelecimento;

  EstablishmentFuel.create({
    idEstabelecimento,
    idCombustivel,
    quantidade,
    preco: Number(preco).toFixed(2),
    dataAtualizacao: moment(),
  })
    .then((fuelData) => {
      return res.status(200).json(fuelData);
    })
    .catch((err) => res.status(500).json({ erro: err }));
};

exports.getEstablishmentFuel = (req, res, next) => {
  // #swagger.tags = ['EstabelecimentoCombustivel']
  // #swagger.description = 'Busca as informações dos combustiveis de um estabelecimento.'
  const idEstabelecimento = req.params.id;

  sequelize
    .query(
      `SELECT *
  FROM   estabelecimentocombustivel
  WHERE  (idCombustivel, idEstabelecimento, dataAtualizacao) IN (
            SELECT idCombustivel, idEstabelecimento, MAX(dataAtualizacao) as dataAtualizacao
            FROM estabelecimentocombustivel
            WHERE idEstabelecimento = :idEstabelecimento
            GROUP BY idCombustivel, idEstabelecimento)`,
      {
        replacements: {
          idEstabelecimento,
        },
      }
    )
    .then((resp) => {
      res.status(200).json(resp[0]);
    })
    .catch((err) => res.status(500).json({ erro: err }));
};

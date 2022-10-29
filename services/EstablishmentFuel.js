const sequelize = require("../utils/database");
const { QueryTypes } = require("sequelize");
const EstablishmentFuel = require("../Models/Establishment_Fuel");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { validationResult } = require("express-validator");

// Adicionar um combustivel ao estabelecimento
exports.addFuelToEstablishment = (req, res, next) => {
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

  EstablishmentFuel.findOne({
    where: {
      idEstabelecimento,
      idCombustivel,
    },
  }).then((result) => {
    if (result !== null)
      res.status(409).json({
        message: "Esse combustivel ja esta associado a esse estabelecimento",
      });
  });

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

// atualizar avalição
exports.updateRating = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Parameters validation failed",
      errors: errors.array(),
    });
  }

  const descricao = req.body.descricao;
  const nota = req.body.nota;
  const idAvaliacao = req.params.idAvaliacao;

  Rating.upsert({
    idAvaliacao,
    descricao,
    nota,
    dataAvaliacao: moment(),
  })
    .then((rating) => {
      return res.status(200).json(rating);
    })
    .catch((err) => res.status(500).json({ erro: err }));
};

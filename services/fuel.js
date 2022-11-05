const { validationResult } = require("express-validator");
const db = require("../utils/database");
const Fuel = require("../Models/fuel");

exports.getFuels = (req, res, next) => {
  // #swagger.tags = ['Combustivel']
  // #swagger.description = 'Endpoint para obter um combustivel. Precisa de autorização'
  Fuel.findAll()
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch((err) => res.status(500).json({ erro: err }));
};

exports.createFuel = (req, res, next) => {
  // #swagger.tags = ['Combustivel']
  // #swagger.description = 'Endpoint para Criar um combustivel.'
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Parameters validation failed",
      errors: errors.array(),
    });
  }

  const { nome, unidade } = req.body;
  Fuel.create({
    nome,
    unidade,
  })
    .then((resp) => res.status(200).send(resp))
    .catch((err) => res.status(500).send(err));
};

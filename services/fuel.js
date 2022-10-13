const { validationResult } = require("express-validator");
const db = require("../utils/database");
const Fuel = require("../Models/fuel");

exports.getFuels = (req, res, next) => {
  Fuel.findAll()
    .then((resp) => {
      if (resp.length === 0) {
        return res.status(404).json({ message: "No fuel found" });
      }
      res.status(200).json(resp);
    })
    .catch((err) => res.status(500).json({ erro: err }));
};

exports.createFuel = (req, res, next) => {
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
    .then((resp) => res.status(201).send(resp))
    .catch((err) => res.status(500).send(err));
};

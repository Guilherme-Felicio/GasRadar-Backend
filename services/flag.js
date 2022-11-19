const { validationResult } = require("express-validator");
const Flag = require("../Models/Flag");

exports.getFlags = (req, res, next) => {
  // #swagger.tags = ['Bandeira']
  // #swagger.description = 'Endpoint para obter um Bandeira.
  Flag.findAll()
    .then((resp) => {
      res.status(200).json(resp);
    })
    .catch((err) => res.status(500).json({ erro: err }));
};

exports.createFlag = (req, res, next) => {
  // #swagger.tags = ['Bandeira']
  // #swagger.description = 'Endpoint para Criar um Bandeira.'
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Parameters validation failed",
      errors: errors.array(),
    });
  }

  const { nome, unidade } = req.body;
  Flag.create({
    nome,
  })
    .then((resp) => res.status(200).send(resp))
    .catch((err) => res.status(500).send(err));
};

const Admin = require("../Models/Admin");
const Establishment = require("../Models/Establishment");
const User = require("../Models/User");
const { validationResult } = require("express-validator");

exports.manageEstablishmentCriation = function (req, res, next) {
  // #swagger.tags = ['Administrador']
  // #swagger.description = 'Aprovar/reprovar Estabelecimento.'

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Parameters validation failed",
      errors: errors.array(),
    });
  }

  const idUsuario = req.body.idUsuario;
  const status = req.body.status;

  // validate email and password

  Admin.update(
    { status: status.toUpperCase() },
    {
      where: {
        idUsuario,
      },
    }
  )
    .then((queryResult) => {
      if (queryResult) {
        return res
          .status(200)
          .json({ message: `Estabelecimento ${status} com sucesso` });
      }
      return res
        .status(200)
        .json({ message: `Estabelecimento não encontrado` });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.getEstabablishmentToApproveList = function (req, res, next) {
  // #swagger.tags = ['Administrador']
  // #swagger.description = 'Aprovar/reprovar Estabelecimento.'

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Parameters validation failed",
      errors: errors.array(),
    });
  }

  Establishment.findAll({
    attributes: { exclude: ["idEstabelecimento"] },
    include: {
      model: User,
      attributes: { exclude: ["senha"] },
    },
    where: {
      status: "PENDENTE",
    },
  })
    .then((queryResult) => {
      return res.status(200).json(queryResult);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

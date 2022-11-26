const Admin = require("../Models/Admin");
const Establishment = require("../Models/Establishment");
const User = require("../Models/User");
const moment = require("moment-timezone");

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

  Establishment.update(
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

exports.getAdmin = function (req, res, next) {
  // #swagger.tags = ['Administrador']
  // #swagger.description = busca os dados de um admin. para buscar basta mandar o token la no header'

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Parameters validation failed",
      errors: errors.array(),
    });
  }

  const idUsuario = res.locals.userData.idUsuario;

  // validate email and password

  Admin.findOne({
    where: {
      idUsuario,
    },
    include: {
      model: User,
      attributes: { exclude: ["senha", "codigoVerificacao"] },
    },
  })
    .then((queryResult) => {
      if (queryResult) {
        const usuario = queryResult.dataValues.usuario.dataValues;
        delete queryResult.dataValues.usuario;
        return res.status(200).json({
          ...queryResult.dataValues,
          ...usuario,
          dataNasc: moment(queryResult.dataValues)
            .tz("America/Sao_Paulo")
            .format("DD/MM/YYYY"),
        });
      }
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

exports.updateAdmin = function (req, res, next) {
  // #swagger.tags = ['Administrador']
  // #swagger.description = 'Atualiazar admin, ja estou pegando id pelo token'

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Parameters validation failed",
      errors: errors.array(),
    });
  }

  const idUsuario = res.locals.userData.idUsuario;
  const nome = req.body.nome;
  const telefone = req.body.telefone;
  const dataNasc = moment(req.body.dataNasc);

  // validate email and password

  Admin.update(
    { nome, telefone, dataNasc },
    {
      where: {
        idUsuario,
      },
    }
  )
    .then((queryResult) => {
      if (queryResult) {
        return res.status(200).json({ message: `Administrador com sucesso` });
      }
      return res
        .status(200)
        .json({ message: `Estabelecimento não encontrado` });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

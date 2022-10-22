const sequelize = require("../utils/database");
const { QueryTypes } = require("sequelize");
const Rating = require("../Models/Rating");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { validationResult } = require("express-validator");

exports.getRating = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Parameters validation failed",
      errors: errors.array(),
    });
  }

  const distancia = req.query.distancia;
  const nota = Number(req.query.nota);

  let queryParams = "";
  if (idBandeira && nota) {
    queryParams = `where idBandeira = ${idBandeira} and nota >= ${nota}`;
  } else {
    queryParams = `where ${
      idBandeira ? "idBandeira = " + idBandeira : "nota >= " + nota
    }`;
  }

  sequelize
    .query(
      `SELECT *, (6371 *
      acos(
          cos(radians(:latitude)) *
          cos(radians(latitude)) *
          cos(radians(:longitude) - radians(longitude)) +
          sin(radians(:latitude)) *
          sin(radians(latitude))
      )) AS distancia
FROM estabelecimento ${
        idBandeira || nota ? queryParams : ""
      } HAVING distancia <= :distancia`,
      {
        replacements: { distancia, latitude, longitude },
        type: QueryTypes.SELECT,
      }
    )
    .then((establishment) => {
      return res.status(200).json({ estabelecimentos: establishment });
    })
    .catch((err) => res.status(500).json({ message: err }));
};

exports.getRating = (req, res, next) => {
  if (!Number.isInteger(Number(req.params.id))) {
    return res
      .status(422)
      .json({ message: "Id do estabelecimento deve ser um valor inteiro." });
  }

  const reqId = req.params.id;

  // finding establishment

  Rating.findOne({
    include: {
      model: User,
    },
    where: {
      idEstabelecimento: reqId,
    },
  }).then((establishmentData) => {
    const data = {
      ...establishmentData.usuario.dataValues,
      ...establishmentData.dataValues,
    };
    delete data.usuario;
    delete data.idUsuario;
    delete data.senha;
    delete data.adm;

    res.status(200).json(data);
  });
};

exports.createRating = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Parameters validation failed",
      errors: errors.array(),
    });
  }

  const descricao = req.body.descricao;
  const nota = req.body.nota;
  const idConsumidor = req.body.idConsumidor;
  const idEstabelecimento = req.body.idEstabelecimento;

  Rating.create({
    descricao,
    nota,
    idConsumidor,
    idEstabelecimento,
    dataAvaliacao: moment(),
  })
    .then((rating) => {
      return res.status(200).json(rating);
    })
    .catch((err) => res.status(500).json({ erro: err }));
};

exports.deleteRating = (req, res, next) => {
  if (!Number.isInteger(Number(req.params.id))) {
    return res
      .status(500)
      .json({ message: "Id do estabelecimento deve ser um valor inteiro." });
  }

  // token ja foi verifacado no establishmentAuth

  const reqId = req.params.id;
  const token = req.get("Authorization").split(" ")[1];
  decodedToken = jwt.verify(token, "secretsecretsecret");
  const idUsuario = decodedToken.userId;
  const idEstabelcimento = decodedToken.establishmentId;

  if (idEstabelecimento !== reqId) {
    return res.status(403).json({
      message:
        "usuário não possui autorização para excluir esse estabelecimento",
    });
  }

  // deleting establishment

  User.destroy({
    where: {
      idUsuario,
    },
  })
    .then((user) => {
      return res.status(200).json({
        message: "Estabelecimento excluido",
        user: user,
        establishment: idEstabelecimento,
      });
    })
    .catch((err) => res.status(500).json({ erro: err }));
};

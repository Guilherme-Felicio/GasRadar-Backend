const sequelize = require("../utils/database");
const { QueryTypes } = require("sequelize");
const Rating = require("../Models/Rating");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
const { validationResult } = require("express-validator");

exports.getAllRatings = (req, res, next) => {
  // #swagger.tags = ['Avaliação']
  // #swagger.description = 'Endpoint para Buscar todas avaliações. A primeira avaliação retornada na paguina sempre será a do usuario solicitante'
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Parameters validation failed",
      errors: errors.array(),
    });
  }

  const idEstabelecimento = Number(req.query.idEstabelecimento);
  const idConsumidor = Number(req.query.idConsumidor);
  const pagina = Number(req.query.pagina);
  const quantidade = Number(req.query.quantidade);

  sequelize
    .query(
      `
      SELECT idAvaliacao, descricao, nota, dataAvaliacao, idEstabelecimento, idConsumidor 
      FROM avaliacao AS avaliacao 
      WHERE avaliacao.idEstabelecimento = :idEstabelecimento 
      ORDER BY idConsumidor = :idConsumidor DESC, dataAvaliacao LIMIT :pagina, :quantidade `,
      {
        replacements: {
          idConsumidor,
          idEstabelecimento,
          quantidade,
          pagina: (pagina - 1) * quantidade,
        },
      }
    )
    .then((rating) => {
      return res.status(200).json(rating[0]);
    })
    .catch((err) => res.status(500).json({ message: err }));
};

// criar avalição
exports.createRating = (req, res, next) => {
  // #swagger.tags = ['Avaliação']
  // #swagger.description = 'Cria uma avaliação. Precisa de autorização'
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

  Rating.findOne({
    where: {
      idConsumidor,
    },
  }).then(() =>
    res
      .status(409)
      .json({ message: "Ja existe uma avaliação desse consumidor" })
  );

  Rating.create({
    idConsumidor,
    idEstabelecimento,
    descricao,
    nota,
    dataAvaliacao: moment().tz("America/Sao_Paulo"),
  })
    .then((rating) => {
      return res.status(200).json(rating);
    })
    .catch((err) => res.status(500).json({ erro: err }));
};

exports.updateRating = (req, res, next) => {
  // #swagger.tags = ['Avaliação']
  // #swagger.description = 'Endpoint para Atualizar um combustivel. Precisa de autorização'
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
    dataAvaliacao: moment().tz("America/Sao_Paulo"),
  })
    .then((rating) => {
      return res.status(200).json(rating);
    })
    .catch((err) => res.status(500).json({ erro: err }));
};

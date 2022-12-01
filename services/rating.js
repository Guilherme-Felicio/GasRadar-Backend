const sequelize = require("../utils/database");
const { QueryTypes } = require("sequelize");
const Rating = require("../Models/Rating");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
const { validationResult } = require("express-validator");

exports.getAllRatings = (req, res, next) => {
  // #swagger.tags = ['Avaliação']
  // #swagger.description = 'Endpoint para Buscar todas avaliações de um estabelecimento. Caso o consumidor tenha uma avaliaão, ela vira por primeiro na primeira pagina'
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
      SELECT idAvaliacao, descricao, nota, dataAvaliacao, idEstabelecimento, consumidor.idConsumidor, consumidor.nome 
      FROM avaliacao AS avaliacao 
      INNER JOIN consumidor ON avaliacao.idConsumidor = consumidor.idConsumidor
      WHERE avaliacao.idEstabelecimento = :idEstabelecimento 
      ORDER BY ${
        idConsumidor ? `avaliacao.idConsumidor = :idConsumidor DESC,` : ""
      }  dataAvaliacao LIMIT :pagina, :quantidade `,
      {
        replacements: {
          idConsumidor,
          idEstabelecimento,
          quantidade,
          pagina: (pagina - 1) * quantidade,
        },
      }
    )
    .then((ratings) => {
      ratings[0].forEach((rating) => {
        rating.dataAvaliacao = moment(rating.dataAvaliacao)
          .tz("America/Sao_Paulo")
          .format("DD/MM/YYYY");
      });
      return res.status(200).json([...ratings[0]]);
    })
    .catch((err) => res.status(500).json({ message: err }));
};

exports.getRating = (req, res, next) => {
  // #swagger.tags = ['Avaliação']
  // #swagger.description = 'Endpoint para obter uma avaliação de um consumidor para um estabelecimento.'

  const idEstabelecimento = Number(req.query.idEstabelecimento);
  const idConsumidor = Number(req.query.idConsumidor);

  Rating.findOne({
    where: {
      idConsumidor,
      idEstabelecimento,
    },
  })
    .then((resp) => {
      if (!resp) return res.status(200).json([]);

      return res.status(200).json([
        {
          ...resp.dataValues,
          dataAvaliacao: moment(resp.dataValues.dataAvaliacao)
            .tz("America/Sao_Paulo")
            .format("DD/MM/YYYY"),
        },
      ]);
    })
    .catch((err) => res.status(500).json({ erro: err }));
};
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
  const idEstabelecimento = req.body.idEstabelecimento;
  const { userData } = res?.locals;
  const idConsumidor = userData?.idConsumidor
    ? userData?.idConsumidor
    : req.body.idConsumidor;

  Rating.findAll({
    where: {
      idConsumidor,
      idEstabelecimento,
    },
  })
    .then((rating) => {
      if (rating.length > 0) {
        return res
          .status(409)
          .json({ message: "Já existe um comentario desse usuario" });
      }

      Rating.create({
        idConsumidor,
        idEstabelecimento,
        descricao,
        nota,
        dataAvaliacao: moment(),
      })
        .then((rating) => {
          return res.status(200).json({
            message: "Avaliação criada com sucesso",
            avaliacao: {
              ...rating.dataValues,
              dataAvaliacao: moment(rating.dataValues.dataAvaliacao)
                .tz("America/Sao_Paulo")
                .format("DD/MM/YYYY"),
            },
          });
        })
        .catch((err) => res.status(500).json({ erro: err }));
    })
    .catch((err) => res.stats(500).json({ message: err }));
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

  Rating.update(
    {
      idAvaliacao,
      descricao,
      nota,
    },
    {
      where: {
        idAvaliacao,
      },
    }
  )
    .then((rating) => {
      return res
        .status(200)
        .json({ message: "Avaliação atualizado com sucesso" });
    })
    .catch((err) => res.status(500).json({ erro: err }));
};

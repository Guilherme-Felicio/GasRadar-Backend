const sequelize = require("../utils/database");
const { QueryTypes } = require("sequelize");
const Rating = require("../Models/Rating");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { validationResult } = require("express-validator");

exports.getAllRatings = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Parameters validation failed",
      errors: errors.array(),
    });
  }

  const idEstabelecimento = Number(req.query.idEstabelecimento);
  const pagina = Number(req.query.pagina);
  const quantidade = Number(req.query.quantidade);

  sequelize
    .query(
      `SELECT *
      FROM   avaliacao
      WHERE  (idConsumidor, idEstabelecimento, dataAvaliacao) IN (
                SELECT idConsumidor, idEstabelecimento, MAX(dataAvaliacao) as dataAvaliacao
                FROM avaliacao
                WHERE idEstabelecimento = :idEstabelecimento
                GROUP BY idConsumidor, idEstabelecimento) limit :pagina, :quantidade`,
      {
        replacements: {
          idEstabelecimento,
          pagina: (pagina - 1) * quantidade,
          quantidade,
        },
      }
    )
    .then((rating) => {
      return res.status(200).json(rating[0]);
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

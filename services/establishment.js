const sequelize = require("../utils/database");
const { QueryTypes } = require("sequelize");
const Establishment = require("../Models/Establishment");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

exports.getEstablishments = (req, res, next) => {
  // #swagger.tags = ['Estabelecimento']
  // #swagger.description = 'Busca estabelecimentos com base nos parametros.'

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Parameters validation failed",
      errors: errors.array(),
    });
  }

  const distancia = Number(req.query.distancia);
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;
  const idBandeira = Number(req.query.idBandeira);
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

exports.getEstablishment = (req, res, next) => {
  // #swagger.tags = ['Estabelecimento']
  // #swagger.description = 'Busca todas informações de um estabelecimento.'
  if (!Number.isInteger(Number(req.params.id))) {
    return res
      .status(422)
      .json({ message: "Id do estabelecimento deve ser um valor inteiro." });
  }

  const reqId = req.params.id;

  // finding establishment

  Establishment.findOne({
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

exports.updateEstablishment = (req, res, next) => {
  // #swagger.tags = ['Estabelecimento']
  // #swagger.description = 'atualiza os dados de um estabelecimento.  Precisa de autorização de estabelecimento'
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Parameters validation failed",
      errors: errors.array(),
    });
  }

  if (!Number.isInteger(Number(req.params.id))) {
    return res
      .status(422)
      .json({ message: "Id do estabelecimento deve ser um valor inteiro." });
  }

  const idEstabelecimento = req.params.id;
  const nome = req.body.nome;
  const telefone = req.body.telefone;
  const endereco = req.body.endereco;
  const numero = req.body.numero;
  const bairro = req.body.bairro;
  const cep = req.body.cep;
  const cidade = req.body.cidade;
  const uf = req.body.uf;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const idBandeira = req.body.idBandeira;
  const urlImagem = req.body.urlImagem;

  Establishment.update(
    {
      nome,
      telefone,
      endereco,
      bairro,
      cep,
      cidade,
      uf,
      latitude,
      longitude,
      idBandeira,
      urlImagem,
      numero,
    },
    {
      where: {
        idEstabelecimento,
      },
    }
  )
    .then(() => {
      return res
        .status(200)
        .json({ message: "Estabelecimento atualizado com sucesso" });
    })
    .catch((err) => res.status(500).json({ erro: err }));
};

exports.deleteEstablishment = (req, res, next) => {
  // #swagger.tags = ['Estabelecimento']
  // #swagger.description = 'deleta um estabelecimento pelo id.  Precisa de autorização'
  if (!Number.isInteger(Number(req.params.id))) {
    return res
      .status(500)
      .json({ message: "Id do estabelecimento deve ser um valor inteiro." });
  }

  // token ja foi verifacado no establishmentAuth

  const reqId = req.params.id;
  const token = req.get("Authorization").split(" ")[1];
  decodedToken = jwt.verify(token, "secretsecretsecret");
  const idUsuario = decodedToken.idUsuario;
  const idEstabelecimento = decodedToken.idEstabelecimento;

  if (Number(idEstabelecimento) !== Number(reqId)) {
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
        usuario: user,
        estabelecimento: idEstabelecimento,
      });
    })
    .catch((err) => res.status(500).json({ erro: err }));
};

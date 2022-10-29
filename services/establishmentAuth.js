const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");

const User = require("../Models/User");
const Establishment = require("../Models/Establishment");
const { validateCNPJ } = require("../utils/validators");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Parameters validation failed",
      errors: errors.array(),
    });
  }

  const email = req.body.email;
  const nome = req.body.nome;
  const cnpj = req.body.cnpj;
  const telefone = req.body.telefone;
  const senha = req.body.senha;
  const endereco = req.body.endereco;
  const bairro = req.body.bairro;
  const cep = req.body.cep;
  const cidade = req.body.cidade;
  const uf = req.body.uf;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const idBandeira = req.body.idBandeira;

  if (!validateCNPJ(cnpj)) {
    return res.status(422).json({ message: "CNPJ Inválido" });
  }

  let responseData;

  bcryptjs
    .hash(senha, 12)
    .then((senhaHashed) => {
      User.create({
        nome,
        email,
        telefone,
        senha: senhaHashed,
        adm: false,
      }).then((user) => {
        responseData = { usuario: user?.dataValues };
        Establishment.create({
          idUsuario: user.dataValues.idUsuario,
          cnpj,
          endereco,
          bairro,
          cep,
          cidade,
          uf,
          latitude: latitude || null,
          longitude: longitude || null,
          idBandeira,
        })
          .then((establishment) => {
            responseData = {
              ...responseData,
              estabelecimento: establishment.dataValues,
              message: "Estabelecimento criado!",
            };
            delete responseData.usuario.senha;
            res.status(201).json(responseData);
          })
          .catch((err) => {
            User.destroy({
              where: {
                idUsuario: responseData.usuario.idUsuario,
              },
            });
            res.status(500).json({ message: err });
          });
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
};

exports.login = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Parameters validation failed",
      errors: errors.array(),
    });
  }
  const email = req.body.email;
  const senha = req.body.senha;

  let establishmentUserData;

  // validate email and password

  Establishment.findOne({
    include: {
      model: User,
      where: {
        email: {
          [Op.eq]: `${email}`,
        },
      },
    },
  })
    .then((queryResult) => {
      console.log(queryResult);
      if (!queryResult) {
        return res.status(401).json({ message: "usuário ou senha incorretos" });
      }
      establishmentUserData = queryResult;
      bcryptjs.compare(senha, queryResult.usuario.senha).then((isEqual) => {
        if (!isEqual) {
          return res
            .status(401)
            .json({ message: "usuário ou senha incorretos" });
        }

        const token = jwt.sign(
          {
            userId: establishmentUserData.usuario.idUsuario,
            establishmentId: establishmentUserData.idEstabelecimento,
            role: "estabelecimento",
          },
          "secretsecretsecret",
          {
            expiresIn: "720h",
          }
        );
        return res.status(200).json({
          token,
          userId: establishmentUserData.usuario.idUsuario.toString(),
          establishmentId: establishmentUserData.idEstabelecimento.toString(),
        });
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

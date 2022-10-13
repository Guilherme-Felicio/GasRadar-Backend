const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const User = require("../Models/User");
const Establishment = require("../Models/Establishment");
const { validationResult } = require("express-validator");

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
  const telefone = req.body.telefone;
  const senha = req.body.senha;
  const endereco = req.body.endereco;
  const bairro = req.body.bairro;
  const cep = req.body.cep;
  const cidade = req.body.cidade;
  const uf = req.body.uf;
  const coordenadas = req.body.coordenadas;
  const idBandeira = req.body.idBandeira;

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
          endereco,
          bairro,
          cep,
          cidade,
          uf,
          coordenadas: coordenadas || null,
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
  const email = req.body.email;
  const senha = req.body.senha;

  let loadedUser;

  User.findOne({
    where: {
      email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "usuário não encontrado" });
      }
      loadedUser = user;
      bcryptjs.compare(senha, user.senha).then((isEqual) => {
        if (!isEqual) {
          return res.status(401).json({ message: "usuário inválido" });
        }

        const token = jwt.sign(
          {
            userId: loadedUser.idUsuario,
            role: "estabelecimento",
          },
          "secretsecretsecret",
          {
            expiresIn: "720h",
          }
        );
        return res
          .status(200)
          .json({ token, userId: loadedUser.idUsuario.toString() });
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

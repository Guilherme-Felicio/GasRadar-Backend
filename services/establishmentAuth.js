const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");

const User = require("../Models/User");
const Establishment = require("../Models/Establishment");
const { validateCNPJ } = require("../utils/validators");

exports.signup = (req, res, next) => {
  // #swagger.tags = ['Estabelecimento']
  // #swagger.description = 'Cria uma conta de estabelecimento.'
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
  const numero = req.body.numero;
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
        email,
        senha: senhaHashed,
        isEmailVerificado: false,
        codigoVerificacao: Math.floor(Math.random() * 1000) + 1,
      }).then((user) => {
        responseData = { email: user?.dataValues.email };
        Establishment.create({
          idUsuario: user.dataValues.idUsuario,
          cnpj,
          nome,
          telefone,
          endereco,
          numero,
          bairro,
          cep,
          cidade,
          uf,
          latitude: latitude || null,
          longitude: longitude || null,
          idBandeira,
          urlImagem:
            "https://www.brasilpostos.com.br/wp-content/uploads/2013/09/PostoPremium.jpg",
        })
          .then((establishment) => {
            responseData = {
              ...responseData,
              ...establishment.dataValues,
              message: "Estabelecimento criado!",
            };
            return res.status(200).json(responseData);
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
  // #swagger.tags = ['Estabelecimento']
  // #swagger.description = 'Login Estabelecimento.'
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
            idUsuario: establishmentUserData.usuario.idUsuario,
            idEstabelecimento: establishmentUserData.idEstabelecimento,
            role: "estabelecimento",
          },
          "secretsecretsecret"
        );
        return res.status(200).json({
          token,
          idUsuario: establishmentUserData.usuario.idUsuario.toString(),
          idEstabelecimento: establishmentUserData.idEstabelecimento.toString(),
        });
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

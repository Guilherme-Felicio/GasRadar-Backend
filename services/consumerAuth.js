const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
const User = require("../Models/User");
const Consumer = require("../Models/Consumer");
const { validationResult } = require("express-validator");
const { validateCPF } = require("../utils/validators");
const { Op } = require("sequelize");

exports.signup = (req, res, next) => {
  // #swagger.tags = ['Consumidor']
  // #swagger.description = 'Cria conta de consumidor.'
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
  const cpf = req.body.cpf;
  const sexo = req.body.sexo;
  const dataNasc = moment(req.body.dataNasc);
  const endereco = req.body.endereco;
  const bairro = req.body.bairro;
  const cep = req.body.cep;
  const numero = req.body.numero;
  const cidade = req.body.cidade;
  const uf = req.body.uf;
  let responseData;

  if (!validateCPF(cpf)) {
    return res.status(422).json({ message: "CPF Inválido" });
  }

  bcryptjs
    .hash(senha, 12)
    .then((senhaHashed) => {
      // criação dos dados na tabela usuario
      User.create({
        email,
        senha: senhaHashed,
        isEmailVerificado: false,
        codigoVerificacao: Math.floor(Math.random() * 1000) + 1,
      }).then((user) => {
        // criação dos dados na tabela consumidor
        responseData = { usuario: user?.dataValues };
        Consumer.create({
          idUsuario: user.dataValues.idUsuario,
          cpf,
          sexo,
          dataNasc,
          endereco,
          nome,
          telefone,
          bairro,
          cep,
          numero,
          cidade,
          uf,
        })
          .then((consumer) => {
            responseData = {
              ...responseData.usuario,
              ...consumer.dataValues,
              dataNasc: moment(dataNasc).format("DD/MM/YYYY"),
              message: "User created!",
            };
            delete responseData.senha;
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
  // #swagger.tags = ['Consumidor']
  // #swagger.description = 'Login Consumidor.'
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Parameters validation failed",
      errors: errors.array(),
    });
  }
  const email = req.body.email;
  const senha = req.body.senha;

  let consumerUserData;

  // validate email and password

  Consumer.findOne({
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
      consumerUserData = queryResult;
      bcryptjs.compare(senha, queryResult.usuario.senha).then((isEqual) => {
        if (!isEqual) {
          return res
            .status(401)
            .json({ message: "usuário ou senha incorretos" });
        }

        const token = jwt.sign(
          {
            userId: consumerUserData.usuario.idUsuario,
            consumerId: consumerUserData.idConsumidor,
            role: "estabelecimento",
          },
          "secretsecretsecret",
          {
            expiresIn: "720h",
          }
        );
        return res.status(200).json({
          token,
          userId: consumerUserData.usuario.idUsuario.toString(),
          consumerId: consumerUserData.idConsumidor.toString(),
        });
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

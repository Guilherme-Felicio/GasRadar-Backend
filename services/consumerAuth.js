const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const User = require("../Models/User");
const Consumer = require("../Models/Consumer");
const { validationResult } = require("express-validator");
const { validateCPF } = require("../utils/validators");

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
  const dataNasc = moment(req.body.dataNasc).format("YYYY-MM-DD HH:mm:ss");
  let responseData;

  if (!validateCPF(cpf)) {
    return res.status(422).json({ message: "CPF Inválido" });
  }

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
        Consumer.create({
          idUsuario: user.dataValues.idUsuario,
          cpf,
          sexo,
          dataNasc,
        })
          .then((consumer) => {
            responseData = {
              ...responseData,
              consumidor: consumer.dataValues,
              message: "User created!",
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
  // #swagger.tags = ['Consumidor']
  // #swagger.description = 'Login consumidor.'
  const email = req.body.email;
  const senha = req.body.senha;

  let consumerUserData;

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
      console.log(queryResult);
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
            establishmentId: consumerUserData.idEstabelecimento,
            role: "consumidor",
          },
          "secretsecretsecret",
          {
            expiresIn: "720h",
          }
        );
        return res.status(200).json({
          token,
          userId: consumerUserData.usuario.idUsuario.toString(),
          establishmentId: consumerUserData.idEstabelecimento.toString(),
        });
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
const User = require("../Models/User");
const Admin = require("../Models/Admin");
const { validationResult } = require("express-validator");
const { validateCPF } = require("../utils/validators");
const { Op } = require("sequelize");

exports.signup = (req, res, next) => {
  // #swagger.tags = ['Administrador']
  // #swagger.description = 'Cria conta de administrador.'
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
  const dataNasc = moment(req.body.dataNasc);
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
        // criação dos dados na tabela administrador
        responseData = { usuario: user?.dataValues };
        Admin.create({
          idUsuario: user.dataValues.idUsuario,
          cpf,
          dataNasc,
          nome,
          telefone,
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
  // #swagger.tags = ['Administrador']
  // #swagger.description = 'Login Administrador.'
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Parameters validation failed",
      errors: errors.array(),
    });
  }
  const email = req.body.email;
  const senha = req.body.senha;

  let adminUserData;

  // validate email and password

  Admin.findOne({
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
      adminUserData = queryResult;
      bcryptjs.compare(senha, queryResult.usuario.senha).then((isEqual) => {
        if (!isEqual) {
          return res
            .status(401)
            .json({ message: "usuário ou senha incorretos" });
        }

        const token = jwt.sign(
          {
            idUsuario: adminUserData.usuario.idUsuario,
            idAdmin: adminUserData.idAdministrador,
            role: "administrador",
          },
          "secretsecretsecret"
        );
        return res.status(200).json({
          token,
          idUsuario: adminUserData.usuario.idUsuario.toString(),
          idAdministrador: adminUserData.idAdministrador.toString(),
        });
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

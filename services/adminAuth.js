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
  const codigoVerificacao = (Math.floor(Math.random() * 9000) + 999).toString();

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
        codigoVerificacao,
      }).then((user) => {
        // criação dos dados na tabela administrador
        responseData = { idUsuario: user?.dataValues.idUsuario };
        Admin.create({
          idUsuario: user.dataValues.idUsuario,
          cpf,
          dataNasc,
          nome,
          telefone,
          urlImagem: null,
        })
          .then((admin) => {
            res.locals.userData = {
              codigoVerificacao,
              email,
              idUsuario: responseData.idUsuario,
            };
            next();
          })
          .catch((err) => {
            User.destroy({
              where: {
                idUsuario: responseData.idUsuario,
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
            idAdministrador: adminUserData?.dataValues?.idAdministrador,
            role: "administrador",
          },
          "secretsecretsecret"
        );
        return res.status(200).json({
          token,
          idUsuario: adminUserData.usuario.idUsuario.toString(),
        });
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.verifycode = function (req, res, next) {
  // #swagger.tags = ['Estabelecimento']
  // #swagger.description = 'Valida codigo verificação.'
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Parameters validation failed",
      errors: errors.array(),
    });
  }
  const email = req.body.email;
  const codigoVerificacao = req.body.codigoVerificacao;

  // validate email and password

  Admin.findOne({
    include: [
      {
        model: User,
        where: {
          email: {
            [Op.eq]: `${email}`,
          },
        },
      },
    ],
  })
    .then((queryResult) => {
      if (!queryResult) {
        return res.status(401).json({ message: "Email não cadastrado" });
      }
      if (
        codigoVerificacao !==
        queryResult.dataValues.usuario.dataValues.codigoVerificacao
      )
        return res.status(403).json({ message: "Codigo Invalido" });

      User.update(
        {
          isEmailVerificado: true,
        },
        {
          where: {
            email,
          },
        }
      )
        .then((resp) => {
          const email = queryResult.dataValues.usuario.dataValues.email;
          const isEmailVerificado = true;
          const idUsuario = queryResult.dataValues.usuario.dataValues.idUsuario;
          delete queryResult.dataValues.usuario;

          return res.status(200).json({
            message: "Codigo verificado com sucesso",
            ...queryResult.dataValues,
            isEmailVerificado,
            email,
            idUsuario,
            dataNasc: moment(queryResult.dataValues.dataNasc)
              .tz("America/Sao_Paulo")
              .format("DD/MM/YYYY"),
          });
        })
        .catch((err) => {
          return res.status(500).json({ message: err.message });
        });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

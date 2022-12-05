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
  const genero = req.body.genero;
  const dataNasc = moment(req.body.dataNasc);
  const endereco = req.body.endereco;
  const bairro = req.body.bairro;
  const cep = req.body.cep;
  const numero = req.body.numero;
  const cidade = req.body.cidade;
  const uf = req.body.uf;
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
        // criação dos dados na tabela consumidor
        responseData = { usuario: user?.dataValues };
        Consumer.create({
          idUsuario: user.dataValues.idUsuario,
          cpf,
          genero,
          dataNasc,
          endereco,
          nome,
          telefone,
          bairro,
          cep,
          numero,
          cidade,
          uf,
          urlImagem: null,
        })
          .then((consumer) => {
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
            idUsuario: consumerUserData.usuario.idUsuario,
            idConsumidor: consumerUserData.idConsumidor,
            role: "estabelecimento",
          },
          "secretsecretsecret"
        );
        return res.status(200).json({
          token,
          idUsuario: consumerUserData.usuario.idUsuario.toString(),
          idConsumidor: consumerUserData.idConsumidor.toString(),
        });
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.verifycode = function (req, res, next) {
  // #swagger.tags = ['Consumidor']
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

  Consumer.findOne({
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

exports.sendChangePasswordEmail = (req, res, next) => {
  // #swagger.tags = ['Consumidor']
  // #swagger.description = 'Envia email de redefinição de senha.'
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Parameters validation failed",
      errors: errors.array(),
    });
  }

  const email = req.body.email;
  const codigoVerificacao = (Math.floor(Math.random() * 9000) + 999).toString();

  User.update(
    {
      codigoVerificacao,
    },
    {
      where: {
        email,
      },
    }
  )
    .then(() => {
      res.locals.userData = {
        codigoVerificacao,
        email,
      };
      next();
    })
    .catch((err) => {
      return res.status(500).json({ message: err });
    });
};

exports.checkPasswordVerifyCode = (req, res, next) => {
  // #swagger.tags = ['Consumidor']
  // #swagger.description = 'Checa o codigo de verificação da redefinição de senha .'
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Parameters validation failed",
      errors: errors.array(),
    });
  }

  const email = req.body.email;
  const codigoVerificacao = req.body.codigoVerificacao;

  Consumer.findOne({
    include: [
      {
        model: User,
        where: {
          email: {
            [Op.eq]: `${email}`,
          },
          codigoVerificacao,
        },
      },
    ],
  })
    .then((user) => {
      console.log(user);
      if (user?.dataValues) {
        user.dataValues.dataNasc = moment(user.dataValues.dataNasc)
          .tz("America/Sao_Paulo")
          .format("DD/MM/YYYY");

        const userData = { ...user.dataValues.usuario.dataValues, email };
        delete user.dataValues.usuario;
        delete userData.senha;
        delete userData.codigoVerificacao;

        return res.status(200).json({
          message: "Codigo verificado com sucesso",
          ...user.dataValues,
          ...userData,
        });
      } else return res.status(403).json({ message: "Codigo inválido" });
    })
    .catch((err) => {
      return res.status(500).json({ message: err });
    });
};

exports.changePassword = (req, res, next) => {
  // #swagger.tags = ['Consumidor']
  // #swagger.description = 'Muda a senha do admin .'
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Parameters validation failed",
      errors: errors.array(),
    });
  }

  const email = req.body.email;
  const codigoVerificacao = req.body.codigoVerificacao;
  const senha = req.body.senha;

  bcryptjs
    .hash(senha, 12)
    .then((senhaHashed) => {
      User.update(
        {
          senha: senhaHashed,
        },
        {
          where: {
            email,
            codigoVerificacao,
          },
        }
      )
        .then(() => {
          return res.status(200).json({
            message: "Senha atualizada com sucesso",
          });
        })
        .catch((err) => {
          return res.status(500).json({ message: err });
        });
    })
    .catch((err) => {
      return res.status(500).json({ message: err });
    });
};

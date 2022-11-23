const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { Op, where } = require("sequelize");
const moment = require("moment");
const User = require("../Models/User");
const Flag = require("../Models/Flag");
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
  const dataFundacao = req.body.dataFundacao;
  const codigoVerificacao = (
    Math.floor(Math.random() * 9000) + 1000
  ).toString();

  if (!validateCNPJ(cnpj)) {
    return res.status(422).json({ message: "CNPJ Inválido" });
  }

  let responseData;

  bcryptjs.hash(senha, 12).then((senhaHashed) => {
    User.create({
      email,
      senha: senhaHashed,
      isEmailVerificado: false,
      codigoVerificacao,
    }).then((user) => {
      responseData = {
        ...user?.dataValues,
      };
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
        dataFundacao: moment(dataFundacao),
        latitude: latitude || null,
        longitude: longitude || null,
        idBandeira,
        horarioAbertura: "08:00",
        horarioEncerramento: "22:00",
        status: "PENDENTE",
        urlImagem:
          "https://www.brasilpostos.com.br/wp-content/uploads/2013/09/PostoPremium.jpg",
        dataTerminoPenalidade: moment().subtract(1, "day"),
      })
        .then(() => {
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
            idConsumidor: establishmentUserData.usuario.idConsumidor,
            role: "estabelecimento",
          },
          "secretsecretsecret"
        );
        return res.status(200).json({
          token,
          idUsuario: establishmentUserData.usuario.idUsuario.toString(),
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

  Establishment.findOne({
    include: [
      {
        model: User,
        where: {
          email: {
            [Op.eq]: `${email}`,
          },
        },
      },
      {
        model: Flag,
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
          const idUsuario = queryResult.dataValues.usuario.dataValues.idUsuario;
          delete queryResult.dataValues.usuario;
          delete queryResult.dataValues.idEstabelecimento;

          return res.status(200).json({
            message: "dados atualizados com sucesso",
            ...queryResult.dataValues,
            email,
            idUsuario,
            dataTerminoPenalidade: moment(
              queryResult.dataValues.dataTerminoPenalidade
            )
              .tz("America/Sao_Paulo")
              .format("DD/MM/YYYY "),
            dataFundacao: moment(queryResult.dataValues.dataFundacao)
              .tz("America/Sao_Paulo")
              .format("DD/MM/YYYY"),
            idUsuario,
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

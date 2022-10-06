const User = require("../Models/genericUser");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
  const endereco = req.body.endereco;
  const bairro = req.body.bairro;
  const cidade = req.body.cidade;
  const cep = req.body.cep;
  const uf = req.body.uf;
  const telefone = req.body.telefone;
  const senha = req.body.senha;

  bcryptjs
    .hash(senha, 12)
    .then((senhaHashed) => {
      User.create({
        nome,
        endereco,
        bairro,
        cidade,
        cep,
        uf,
        email,
        telefone,
        senha: senhaHashed,
      }).then((result) => res.status(201).json(result));
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
            email: loadedUser.email,
            userId: loadedUser.idUsuario,
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

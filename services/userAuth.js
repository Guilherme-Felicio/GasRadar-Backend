const User = require("../Models/User");
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
  const telefone = req.body.telefone;
  const senha = req.body.senha;

  bcryptjs
    .hash(senha, 12)
    .then((senhaHashed) => {
      User.create({
        nome,
        email,
        telefone,
        senha: senhaHashed,
        adm: false,
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
            idUsuario: loadedUser.idUsuario,
            role: "estabelecimento",
          },
          "secretsecretsecret"
        );
        return res
          .status(200)
          .json({ token, idUsuario: loadedUser.idUsuario.toString() });
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

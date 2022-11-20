const express = require("express");
const { body } = require("express-validator");
const User = require("../Models/User");
const consumerAuth = require("../services/consumerAuth");
const router = express.Router();

// rotas de criação/login de consumidor

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Por favor, digite um email válido")
      .custom((value, { req }) => {
        return User.findOne({ where: { email: value } }).then((userDoc) => {
          if (userDoc) return Promise.reject("Email Já existe!");
        });
      })
      .normalizeEmail(),
    body("senha").isLength({ min: 5 }),
    body("nome").not().isEmpty().isLength({ max: 30 }),
    body("telefone").not().isEmpty().isInt({ min: 1, max: 9999999999999 }),
    body("genero").trim().not().isEmpty().isLength({ min: 1, max: 15 }),
    body("dataNasc").trim().not().isEmpty(),
    body("endereco").not().isEmpty().isLength({ min: 1, max: 50 }),
    body("bairro").not().isEmpty().isLength({ min: 1, max: 30 }),
    body("cep").trim().not().isEmpty().isLength({ min: 1, max: 8 }),
    body("cidade").not().isEmpty().isLength({ min: 1, max: 50 }),
    body("uf").trim().not().isEmpty().isLength({ min: 2, max: 2 }),
    body("numero").isInt(),
  ],
  consumerAuth.signup
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Por favor, digite um email válido"),
    body("senha"),
  ],
  consumerAuth.login
);

module.exports = router;

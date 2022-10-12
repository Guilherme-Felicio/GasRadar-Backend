const express = require("express");
const { body } = require("express-validator");
const User = require("../Models/User");
const authController = require("../services/auth");
const consumerAuth = require("../services/consumerAuth");

const router = express.Router();

// rotas de criação/login de consumidor

router.put(
  "/consumer/signup",
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
    body("cpf").trim().not().isEmpty().isLength({ min: 11, max: 11 }),
    body("genero").trim().not().isEmpty().isLength({ min: 1, max: 1 }),
    body("dataNasc").trim().not().isEmpty(),
  ],
  consumerAuth.signup
);

router.post(
  "consumer/login",
  [
    body("email").isEmail().withMessage("Por favor, digite um email válido"),
    body("senha"),
  ],
  consumerAuth.login
);

module.exports = router;

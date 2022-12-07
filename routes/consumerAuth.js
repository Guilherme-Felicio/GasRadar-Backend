const express = require("express");
const { body, query } = require("express-validator");
const User = require("../Models/User");
const consumerAuth = require("../services/consumerAuth");
const emailController = require("../services/sendEmails");
const cpfCnpjValidation = require("../services/cpfCnpjValidation");
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
  consumerAuth.signup,
  emailController.sendVerificationEmail
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Por favor, digite um email válido"),
    body("senha"),
  ],
  consumerAuth.login
);

router.post(
  "/verifyCode",
  [
    body("email").isEmail().normalizeEmail(),
    body("codigoVerificacao").isLength({ min: 4 }),
  ],
  consumerAuth.verifycode
);

router.get(
  "/validation",
  [query("cnpj").isLength({ min: 11, max: 11 })],
  cpfCnpjValidation.checkIfCpfExistsAndIsValid
);

router.post(
  "/sendPasswordChangeEmail",
  [
    body("email")
      .isEmail()
      .withMessage("Por favor, digite um email válido")
      .custom((value, { req }) => {
        return User.findOne({ where: { email: value } }).then((userDoc) => {
          if (!userDoc) return Promise.reject("Email Não existe!");
        });
      })
      .normalizeEmail(),
  ],
  consumerAuth.sendChangePasswordEmail,
  emailController.sendVerificationEmail
);

router.post(
  "/verifyPasswordChangeCode",
  [
    body("email").isEmail().normalizeEmail(),
    body("codigoVerificacao").isLength({ min: 4 }),
  ],
  consumerAuth.checkPasswordVerifyCode
);

router.post(
  "/changePassword",
  [
    body("email").isEmail().normalizeEmail(),
    body("codigoVerificacao").isLength({ min: 4 }),
    body("senha").isLength({ min: 5 }),
  ],
  consumerAuth.changePassword
);

module.exports = router;

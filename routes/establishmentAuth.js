const express = require("express");
const { body, query } = require("express-validator");
const User = require("../Models/User");
const establishmentAuth = require("../services/establishmentAuth");
const emailController = require("../services/sendEmails");
const Establishment = require("../Models/Establishment");
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
    body("senha").isLength({ min: 8 }),
    body("cnpj").isLength({ min: 14, max: 14 }),
    body("nome").not().isEmpty().isLength({ max: 30 }),
    body("endereco").not().isEmpty().isLength({ min: 1, max: 50 }),
    body("numero").isInt({ min: 1 }),
    body("bairro").not().isEmpty().isLength({ min: 1, max: 30 }),
    body("cep").trim().not().isEmpty().isLength({ min: 1, max: 8 }),
    body("cidade").not().isEmpty().isLength({ min: 1, max: 50 }),
    body("uf").trim().not().isEmpty().isLength({ min: 2, max: 2 }),
    body("idBandeira").isInt({ min: 1 }),
    body("latitude"),
    body("longitude"),
  ],
  establishmentAuth.signup,
  emailController.sendVerificationEmail
);

router.post(
  "/verifyCode",
  [
    body("email").isEmail().normalizeEmail(),
    body("codigoVerificacao").isLength({ min: 4 }),
  ],
  establishmentAuth.verifycode
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Por favor, digite um email válido"),
    body("senha"),
  ],
  establishmentAuth.login
);

router.get(
  "/validation",
  [query("cnpj").isLength({ min: 14, max: 14 })],
  cpfCnpjValidation.checkIfCnpjExistsAndIsValid
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
  establishmentAuth.sendChangePasswordEmail,
  emailController.sendVerificationEmail
);

router.post(
  "/verifyPasswordChangeCode",
  [
    body("email").isEmail().normalizeEmail(),
    body("codigoVerificacao").isLength({ min: 4 }),
  ],
  establishmentAuth.checkPasswordVerifyCode
);

router.post(
  "/changePassword",
  [
    body("email").isEmail().normalizeEmail(),
    body("codigoVerificacao").isLength({ min: 4 }),
    body("senha").isLength({ min: 5 }),
  ],
  establishmentAuth.changePassword
);

module.exports = router;

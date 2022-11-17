const express = require("express");
const { body } = require("express-validator");
const User = require("../Models/User");
const consumerAuth = require("../services/consumerAuth");
const adminAuth = require("../services/adminAuth");

const router = express.Router();

// rotas de criação/login de administrador

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
    body("dataNasc").trim().not().isEmpty(),
  ],
  adminAuth.signup
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

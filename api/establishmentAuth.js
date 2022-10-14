const express = require("express");
const { body } = require("express-validator");
const User = require("../Models/User");
const establishmentAuth = require("../services/establishmentAuth");

const router = express.Router();

// rotas de criação/login de consumidor

router.put(
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
    body("endereco").not().isEmpty().isLength({ min: 1, max: 50 }),
    body("bairro").not().isEmpty().isLength({ min: 1, max: 30 }),
    body("cep").trim().not().isEmpty().isLength({ min: 1, max: 8 }),
    body("cidade").not().isEmpty().isLength({ min: 1, max: 50 }),
    body("uf").trim().not().isEmpty().isLength({ min: 2, max: 2 }),
    body("idBandeira").trim().not().isEmpty().isLength({ min: 1 }),
    body("latitude"),
    body("longitude"),
  ],
  establishmentAuth.signup
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Por favor, digite um email válido"),
    body("senha"),
  ],
  establishmentAuth.login
);

module.exports = router;

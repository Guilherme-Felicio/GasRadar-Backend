const express = require("express");
const { body } = require("express-validator");
const User = require("../Models/User");
const admin = require("../services/admin");
const checkAdminAuth = require("../utils/checkAdminAuth");

const router = express.Router();

// rotas de criação/login de administrador

router.put(
  "/manageEstablishment,",
  [body("idUsuario").isInt({ min: 1 }), body("status").isInt({ min: 1 })],
  admin.manageEstablishmentCriation
);

router.get("/manageEstablishment", [], admin.getEstabablishmentToApproveList);

router.get("/", [], checkAdminAuth, admin.getEstabablishmentToApproveList);

router.put(
  "/",
  [
    body("nome").not().isEmpty().isLength({ max: 30 }),
    body("telefone").not().isEmpty().isInt({ min: 1, max: 9999999999999 }),
    body("dataNasc").trim().not().isEmpty(),
  ],
  checkAdminAuth,
  admin.updateAdmin
);

module.exports = router;

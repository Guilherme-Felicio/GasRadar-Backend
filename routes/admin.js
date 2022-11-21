const express = require("express");
const { body } = require("express-validator");
const User = require("../Models/User");
const admin = require("../services/admin");

const router = express.Router();

// rotas de criação/login de administrador

router.put(
  "/",
  [body("idUsuario").isInt({ min: 1 }), body("status").isInt({ min: 1 })],
  admin.manageEstablishmentCriation
);
router.get("/", [], admin.getEstabablishmentToApproveList);

module.exports = router;

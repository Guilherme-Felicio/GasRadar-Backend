const express = require("express");
const router = express.Router();
const consumerController = require("../services/consumer");
const { body } = require("express-validator");
const checkConsumerAuth = require("../utils/checkConsumerAuth");

router.patch(
  "/:id",
  [
    body("nome").not().isEmpty().isLength({ max: 30 }),
    body("sexo").trim().not().isEmpty().isLength({ min: 1, max: 15 }),
    body("dataNasc").trim().not().isEmpty(),
    body("endereco").not().isEmpty().isLength({ min: 1, max: 50 }),
    body("bairro").not().isEmpty().isLength({ min: 1, max: 30 }),
    body("cep").trim().not().isEmpty().isLength({ min: 1, max: 8 }),
    body("cidade").not().isEmpty().isLength({ min: 1, max: 50 }),
    body("uf").trim().not().isEmpty().isLength({ min: 2, max: 2 }),
  ],
  checkConsumerAuth,
  consumerController.updateConsumer
);

router.delete("/:id", checkConsumerAuth, consumerController.deleteConsumer);

router.get("/:id", consumerController.getConsumer);

module.exports = router;

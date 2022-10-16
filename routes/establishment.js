const express = require("express");
const router = express.Router();
const establishmentService = require("../services/establishment");
const checkEstablishmentAuth = require("../utils/checkEstablishmentAuth");
const { body, query } = require("express-validator");

router.put(
  "/update/:id",
  [
    body("nome").not().isEmpty().isLength({ max: 30 }),
    body("endereco").not().isEmpty().isLength({ min: 1, max: 50 }),
    body("bairro").not().isEmpty().isLength({ min: 1, max: 30 }),
    body("cep").trim().not().isEmpty().isLength({ min: 1, max: 8 }),
    body("cidade").not().isEmpty().isLength({ min: 1, max: 50 }),
    body("uf").trim().not().isEmpty().isLength({ min: 2, max: 2 }),
    body("idBandeira").trim().not().isEmpty().isLength({ min: 1 }),
    body("latitude"),
    body("longitude"),
    body("urlImagem"),
  ],

  establishmentService.updateEstablishment
);

router.delete(
  "/:id",
  checkEstablishmentAuth,
  establishmentService.deleteEstablishment
);

router.get(
  "/",
  [
    query("latitude")
      .isLength({ min: 1, max: 11 })
      .matches(/([0-9.-]+).+?([0-9.-]+)/),
    query("longitude")
      .isLength({ min: 1, max: 11 })
      .matches(/([0-9.-]+).+?([0-9.-]+)/),
    query("distancia").isLength({ min: 1, max: 6 }),
  ],
  establishmentService.getEstablishment
);

module.exports = router;
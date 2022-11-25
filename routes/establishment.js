const express = require("express");
const router = express.Router();
const establishmentService = require("../services/establishment");
const checkEstablishmentAuth = require("../utils/checkEstablishmentAuth");
const { body, query } = require("express-validator");

router.put(
  "/",
  [
    // body("cnpj").not().isEmpty().isLength({ min: 1, max: 14 }),
    body("nome").not().isEmpty().isLength({ max: 30 }),
    body("endereco").not().isEmpty().isLength({ min: 1, max: 50 }),
    body("bairro").not().isEmpty().isLength({ min: 1, max: 30 }),
    body("cep").trim().not().isEmpty().isLength({ min: 1, max: 8 }),
    body("cidade").not().isEmpty().isLength({ min: 1, max: 50 }),
    body("uf").trim().not().isEmpty().isLength({ min: 2, max: 2 }),
    body("idBandeira").trim().not().isEmpty().isLength({ min: 1 }),
    body("horarioAbertura").isLength({ min: 1, max: 30 }),
    body("horarioFechamento").isLength({ min: 1, max: 30 }),
    body("latitude"),
    body("longitude"),
    body("urlImagem"),
  ],
  checkEstablishmentAuth,
  establishmentService.updateEstablishment
);

router.delete(
  "/:id",
  checkEstablishmentAuth,
  establishmentService.deleteEstablishment
);

router.get("/:id", establishmentService.getEstablishment);

router.get(
  "/",
  [
    query("latitude")
      .isLength({ min: 1, max: 11 })
      .matches(/([0-9.-]+).+?([0-9.-]+)/),
    query("longitude")
      .isLength({ min: 1, max: 11 })
      .matches(/([0-9.-]+).+?([0-9.-]+)/),
    query("distancia").isFloat({ min: 1 }),
    query("nota").optional({ checkFalsy: true }).isFloat({ max: 10 }),
    query("idBandeira").optional({ checkFalsy: true }).isInt(),
  ],
  establishmentService.getEstablishments
);

module.exports = router;

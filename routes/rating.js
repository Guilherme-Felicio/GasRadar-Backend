const express = require("express");
const router = express.Router();
const establishmentService = require("../services/establishment");
const ratingService = require("../services/rating");
const { body, query } = require("express-validator");

router.post(
  "/",
  [
    body("descricao").not().isEmpty().isLength({ max: 200 }),
    body("nota").not().isEmpty().isFloat({ max: 10 }),
    body("idConsumidor").isInt({ min: 1 }),
    body("idEstabelecimento").isInt({ min: 1 }),
  ],

  ratingService.createRating
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

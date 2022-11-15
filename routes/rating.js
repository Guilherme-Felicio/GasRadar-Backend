const express = require("express");
const router = express.Router();
const establishmentService = require("../services/establishment");
const checkConsumerAuth = require("../utils/checkConsumerAuth");
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
  checkConsumerAuth,
  ratingService.createRating
);

router.patch(
  "/",
  [
    body("descricao").not().isEmpty().isLength({ max: 200 }),
    body("nota").not().isEmpty().isFloat({ max: 10 }),
    body("idAvaliacao").isInt({ min: 1 }),
  ],
  checkConsumerAuth,
  ratingService.updateRating
);

router.get(
  "/",
  [
    query("idEstabelecimento").isInt({ min: 1 }),
    query("idConsumidor").isInt({ min: 1 }),
    query("pagina").isInt({ min: 1 }),
    query("quantidade").isInt({ min: 1 }),
  ],
  ratingService.getAllRatings
);

module.exports = router;

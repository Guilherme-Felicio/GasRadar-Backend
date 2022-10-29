const express = require("express");
const router = express.Router();
const establishmentFuelService = require("../services/EstablishmentFuel");
const { body, query } = require("express-validator");

router.post(
  "/",
  [
    body("quantidade").isFloat({ min: 0.1 }),
    body("preco").isFloat({ min: 0.1 }),
    body("idCombustivel").isInt({ min: 1 }),
    body("idEstabelecimento").isInt({ min: 1 }),
  ],

  establishmentFuelService.addFuelToEstablishment
);

// router.patch(
//   "/",
//   [
//     body("descricao").not().isEmpty().isLength({ max: 200 }),
//     body("nota").not().isEmpty().isFloat({ max: 10 }),
//     body("idAvaliacao").isInt({ min: 1 }),
//   ],

//   establishmentFuelService.updateRating
// );

// router.get(
//   "/",
//   [
//     query("idEstabelecimento").isInt({ min: 1 }),
//     body("idConsumidor").isInt({ min: 1 }),
//     query("pagina").isInt({ min: 1 }),
//     query("quantidade").isInt({ min: 1 }),
//   ],
//   establishmentFuelService.getAllRatings
// );

module.exports = router;

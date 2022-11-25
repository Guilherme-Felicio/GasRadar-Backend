const express = require("express");
const router = express.Router();
const establishmentFuelService = require("../services/EstablishmentFuel");
const checkEstablishmentAuth = require("../utils/checkEstablishmentAuth");
const { body, query } = require("express-validator");

router.post(
  "/",
  [
    body("quantidade").isFloat({ min: 0.1 }),
    body("preco").isFloat({ min: 0.1 }),
    body("idCombustivel").isInt({ min: 1 }),
  ],
  checkEstablishmentAuth,
  establishmentFuelService.addFuelToEstablishment
);

router.delete(
  "/:id",
  checkEstablishmentAuth,
  establishmentFuelService.deleteFuelOfEstablishment
);

router.put(
  "/:id",
  checkEstablishmentAuth,
  establishmentFuelService.updateFuelOfEstablishment
);

router.get(
  "/:id",
  [body("idEstabelecimento").isInt({ min: 1 })],
  establishmentFuelService.getEstablishmentFuel
);

module.exports = router;

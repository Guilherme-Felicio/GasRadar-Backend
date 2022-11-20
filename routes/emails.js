const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const fuelsController = require("../services/fuel");
const emails = require("../services/sendEmails");
const checkConsumerAuth = require("../utils/checkConsumerAuth");
const checkEstablishmentAuth = require("../utils/checkEstablishmentAuth");

router.post("/email", emails.sendEmail);

router.get("/", checkEstablishmentAuth, fuelsController.getFuels);

router.post(
  "/",
  [
    body("nome").isLength({ min: 1, max: 30 }),
    body("unidade").isLength({ min: 1, max: 20 }),
  ],
  fuelsController.createFuel
);

module.exports = router;

const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const fuelsController = require("../controllers/fuel");
const isAuth = require("../middleware/is-auth");

router.get("/", isAuth, fuelsController.getFuels);

router.post(
  "/",
  [
    body("nome").isLength({ min: 1, max: 30 }),
    body("unidade").isLength({ min: 1, max: 20 }),
  ],
  fuelsController.createFuel
);

module.exports = router;

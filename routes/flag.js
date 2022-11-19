const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const flagsController = require("../services/flag");

router.get("/", flagsController.getFlags);

router.post(
  "/",
  [body("nome").isLength({ min: 1, max: 30 })],
  flagsController.createFlag
);

module.exports = router;

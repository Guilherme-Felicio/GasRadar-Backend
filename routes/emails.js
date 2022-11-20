const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const emails = require("../services/sendEmails");
const checkConsumerAuth = require("../utils/checkConsumerAuth");
const checkEstablishmentAuth = require("../utils/checkEstablishmentAuth");

router.post("/", emails.sendVerificationEmail);

module.exports = router;

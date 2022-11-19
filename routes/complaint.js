const express = require("express");
const router = express.Router();
const checkConsumerAuth = require("../utils/checkConsumerAuth");
const ratingService = require("../services/rating");
const complaintService = require("../services/complaint");
const { body, query } = require("express-validator");

router.post(
  "/",
  [
    body("descricao").not().isEmpty().isLength({ max: 200 }),
    body("motivo").isInt({ min: 1 }),
    body("idEstabelecimento").isInt({ min: 1 }),
  ],
  checkConsumerAuth,
  complaintService.createComplaint
);

router.get(
  "/",
  [query("pagina").isInt({ min: 1 }), query("quantidade").isInt({ min: 1 })],
  complaintService.getAllComplaints
);

router.patch(
  "/manageComplaint",
  [
    body("idDenuncia").isInt({ min: 1 }),
    body("descricao").isLength({ min: 1 }),
    body("status").isLength({ min: 1 }),
  ],
  complaintService.manageComplaint
);

module.exports = router;

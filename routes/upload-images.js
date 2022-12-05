const express = require("express");
const router = express.Router();
const multer = require("multer");
const { body } = require("express-validator");
const imageUploadController = require("../services/image-upload");
const { diskStorage } = require("multer");
const moment = require("moment");
const checkEstablishmentAuth = require("../utils/checkEstablishmentAuth");
const checkConsumerAuth = require("../utils/checkConsumerAuth");
const checkAdminAuth = require("../utils/checkAdminAuth");

const upload = multer({
  limits: {
    fileSize: 500000000,
  },
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, "images");
    },
    filename: (req, file, cb) => {
      cb(null, moment().format("YYYY-MM-DD") + "-" + file.originalname);
    },
  }),
  // fileFilter: (req, file, cb) => {
  //   if (
  //     file.mimetype === "image/png" ||
  //     file.mimetype === "image/jpg" ||
  //     file.mimetype === "image/jpeg"
  //   ) {
  //     cb(null, true);
  //   } else {
  //     cb(null, false);
  //   }
  // },
});

router.post(
  "/consumer",
  upload.single("image"),
  checkConsumerAuth,
  imageUploadController.uploadImage
);
router.post(
  "/establishment",
  upload.single("image"),
  checkEstablishmentAuth,
  imageUploadController.uploadImage
);
router.post(
  "/admin",
  upload.single("image"),
  checkAdminAuth,
  imageUploadController.uploadImage
);

module.exports = router;

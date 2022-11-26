const express = require("express");
const router = express.Router();
const multer = require("multer");
const { body } = require("express-validator");
const imageUploadController = require("../services/image-upload");
const { diskStorage } = require("multer");
const moment = require("moment");
const checkConsumerAuth = require("../utils/checkConsumerAuth");

const upload = multer({
  limits: {
    fileSize: 5000000,
  },
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, "images");
    },
    filename: (req, file, cb) => {
      cb(null, moment().format("YYYY-MM-DD") + "-" + file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

router.post(
  "/consumer",
  upload.single("image"),
  imageUploadController.uploadImage
);

module.exports = router;

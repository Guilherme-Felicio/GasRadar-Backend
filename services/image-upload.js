const { validationResult } = require("express-validator");
const moment = require("moment");
const multer = require("multer");

exports.uploadImage = (req, res, next) => {
  // #swagger.tags = ['Upload de Imagens']
  // #swagger.description = 'Endpoint para Subir uma imagem.'

  res.status(200).json({ message: "ok" });
};

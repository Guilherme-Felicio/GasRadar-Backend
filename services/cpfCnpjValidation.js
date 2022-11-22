const { validationResult } = require("express-validator");
const Establishment = require("../Models/Establishment");
const { validateCNPJ } = require("../utils/validators");

exports.checkIfCnpjExistsAndIsValid = (req, res, next) => {
  // #swagger.tags = ['Estabelecimento']
  // #swagger.description = 'Endpoint para verificar se cpf é valido.

  const cnpj = req.query.cnpj;

  // valida se cpf existe no banco
  Establishment.findOne({ where: { cnpj } })
    .then((establishment) => {
      if (establishment) {
        return res.status(200).json(false);
      }

      const isCnpjValid = validateCNPJ(cnpj);

      if (isCnpjValid) return res.status(200).json(true);
      return res.status(422).json({ message: "Cpnj Invalido" });
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
};

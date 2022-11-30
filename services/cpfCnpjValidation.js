const { validationResult } = require("express-validator");
const Consumer = require("../Models/Consumer");
const Establishment = require("../Models/Establishment");
const { validateCNPJ, validateCPF } = require("../utils/validators");

exports.checkIfCnpjExistsAndIsValid = (req, res, next) => {
  // #swagger.tags = ['Estabelecimento']
  // #swagger.description = 'Endpoint para verificar se CNPJ é valido.

  const cnpj = req.query.cnpj;

  // valida se cnpj existe no banco
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

exports.checkIfCpfExistsAndIsValid = (req, res, next) => {
  // #swagger.tags = ['Consumidor']
  // #swagger.description = 'Endpoint para verificar se cpf é valido.

  const cpf = req.query.cpf;

  // valida se cpf existe no banco
  Consumer.findOne({ where: { cpf } })
    .then((consumer) => {
      if (consumer) {
        return res.status(200).json(false);
      }

      const isCpfValid = validateCPF(cpf);

      if (isCpfValid) return res.status(200).json(true);
      return res.status(422).json({ message: "CPF Invalido" });
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
};

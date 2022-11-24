const sequelize = require("../utils/database");
const EstablishmentFuel = require("../Models/Establishment_Fuel");
const Establishment = require("../Models/Establishment");
const moment = require("moment-timezone");
const { validationResult } = require("express-validator");

// Adicionar um combustivel ao estabelecimento
exports.addFuelToEstablishment = (req, res, next) => {
  // #swagger.tags = ['EstabelecimentoCombustivel']
  // #swagger.description = 'Endpoint para adicionar um combustivel a um estabelecimento. Precisa de autorização'
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Parameters validation failed",
      errors: errors.array(),
    });
  }

  const quantidade = req.body.quantidade;
  const preco = req.body.preco;
  const idCombustivel = req.body.idCombustivel;
  const { userData } = res.locals;
  const idEstabelecimento = userData.idEstabelecimento;

  EstablishmentFuel.create({
    idEstabelecimento,
    idCombustivel,
    quantidade,
    preco: Number(preco).toFixed(3),
    dataAtualizacao: moment(),
  })
    .then((fuelData) => {
      return res.status(200).json({
        ...fuelData.dataValues,
        dataAtualizacao: moment().tz("America/Sao_Paulo").format("DD/MM/YYYY"),
      });
    })
    .catch((err) => res.status(500).json({ erro: err }));
};

exports.getEstablishmentFuel = (req, res, next) => {
  // #swagger.tags = ['EstabelecimentoCombustivel']
  // #swagger.description = 'Busca as informações dos combustiveis de um estabelecimento.'
  const idEstabelecimento = req.params.id;

  sequelize
    .query(
      `SELECT *
  FROM   estabelecimentocombustivel
  WHERE  (idCombustivel, idEstabelecimento, dataAtualizacao) IN (
            SELECT idCombustivel, idEstabelecimento, MAX(dataAtualizacao) as dataAtualizacao
            FROM estabelecimentocombustivel
            WHERE idEstabelecimento = :idEstabelecimento
            GROUP BY idCombustivel, idEstabelecimento)`,
      {
        replacements: {
          idEstabelecimento,
        },
      }
    )
    .then((resp) => {
      resp[0].forEach((establishmentFuel) => {
        establishmentFuel.dataAtualizacao = moment(
          establishmentFuel.dataAtualizacao
        )
          .tz("America/Sao_Paulo")
          .format("DD/MM/YYYY");
      });
      res.status(200).json([...resp[0]]);
    })
    .catch((err) => res.status(500).json({ erro: err }));
};

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
  const { idEstabelecimento } = userData;

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
  INNER JOIN combustivel ON estabelecimentocombustivel.idCombustivel = combustivel.idCombustivel
  WHERE  (estabelecimentocombustivel.idCombustivel, estabelecimentocombustivel.idEstabelecimento, estabelecimentocombustivel.dataAtualizacao) IN (
    SELECT estabelecimentocombustivel.idCombustivel, estabelecimentocombustivel.idEstabelecimento, MAX(estabelecimentocombustivel.dataAtualizacao) as dataAtualizacao
    FROM estabelecimentocombustivel
    INNER JOIN combustivel ON estabelecimentocombustivel.idCombustivel = combustivel.idCombustivel
    WHERE idEstabelecimento = :idEstabelecimento
    GROUP BY idCombustivel, idEstabelecimento)
    `,
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
        establishmentFuel.bandeira = {
          idCombustivel: establishmentFuel.idCombustivel,
          nome: establishmentFuel.nome,
          unidade: establishmentFuel.unidade,
        };

        delete establishmentFuel.idCombustivel;
        delete establishmentFuel.nome;
        delete establishmentFuel.unidade;
      });

      res.status(200).json([...resp[0]]);
    })
    .catch((err) => res.status(500).json({ erro: err }));
};

exports.deleteFuelOfEstablishment = (req, res, next) => {
  // #swagger.tags = ['EstabelecimentoCombustivel']
  // #swagger.description = 'Endpoint para Excluir um combustivel de um estabelecimento (passe idEstabelecimentoCombustivel). Precisa de autorização'
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Parameters validation failed",
      errors: errors.array(),
    });
  }

  const idEstabelecimentoCombustivel = req.params.id;
  const idEstabelecimento = res.locals.userData.idEstabelecimento;

  EstablishmentFuel.destroy({
    where: {
      idEstabelecimento,
      idEstabelecimentoCombustivel,
    },
  })
    .then((fuelData) => {
      if (!fuelData)
        return res.status(200).json({
          message: "Não existe combustivelEstabelecimento com esse id",
        });
      return res.status(200).json({
        message: "combustivel excluido com sucesso",
      });
    })
    .catch((err) => res.status(500).json({ erro: err }));
};

exports.updateFuelOfEstablishment = (req, res, next) => {
  // #swagger.tags = ['EstabelecimentoCombustivel']
  // #swagger.description = 'Endpoint para atualizar um combustivel de um estabelecimento (passe idEstabelecimentoCombustivel). Precisa de autorização'
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Parameters validation failed",
      errors: errors.array(),
    });
  }

  const quantidade = req.body.quantidade;
  const preco = req.body.preco;
  const idEstabelecimentoCombustivel = req.params.id;
  const idEstabelecimento = res.locals.userData.idEstabelecimento;

  EstablishmentFuel.update(
    {
      preco,
      quantidade,
    },
    {
      where: {
        idEstabelecimento,
        idEstabelecimentoCombustivel,
      },
    }
  )
    .then(() => {
      return res.status(200).json({
        message: "combustivel atualizado com sucesso",
      });
    })
    .catch((err) => res.status(500).json({ erro: err }));
};

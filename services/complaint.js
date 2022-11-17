const Complaint = require("../Models/Complaint");
const moment = require("moment-timezone");
const { validationResult } = require("express-validator");

exports.getAllComplaints = (req, res, next) => {
  // #swagger.tags = ['Denuncias']
  // #swagger.description = 'Endpoint para Buscar todas denuncias.'
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Parameters validation failed",
      errors: errors.array(),
    });
  }

  const pagina = Number(req.query.pagina);
  const quantidade = Number(req.query.quantidade);

  Complaint.findAll({
    order: [["dataDenuncia", "DESC"]],
    offset: (pagina - 1) * quantidade,
    limit: quantidade,
    subQuery: false,
  })
    .then((complaints) => {
      complaints.forEach((complaint) => {
        complaint.dataValues.dataDenuncia = moment(complaint.dataDenuncia)
          .tz("America/Sao_Paulo")
          .format("DD/MM/YYYY HH:mm");
      });
      return res.status(200).json(complaints);
    })
    .catch((err) => res.status(500).json({ message: err }));
};

exports.createComplaint = (req, res, next) => {
  // #swagger.tags = ['Denuncia']
  // #swagger.description = 'Cria uma Denuncia. Precisa de autorização'
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Parameters validation failed",
      errors: errors.array(),
    });
  }

  const descricao = req.body.descricao;
  const idConsumidor = req.body.idConsumidor;
  const idEstabelecimento = req.body.idEstabelecimento;

  Complaint.findAll({
    where: {
      idConsumidor,
      idEstabelecimento,
    },
  })
    .then((complaint) => {
      if (complaint.length > 0) {
        return res.status(409).json({
          message:
            "Já existe uma denuncia desse usuario para esse estabelecimento",
        });
      }

      Complaint.create({
        idConsumidor,
        idEstabelecimento,
        idAdministrador: null,
        descricao,
        status: "PENDENTE",
        dataInicioPenalidade: null,
        dataTerminoPenalidade: null,
        dataDenuncia: moment(),
      })
        .then((complaint) => {
          return res.status(200).json({
            message: "Denuncia criada com sucesso",
            avaliacao: {
              ...complaint.dataValues,
              dataDenuncia: moment(complaint.dataValues.dataDenuncia)
                .tz("America/Sao_Paulo")
                .format("DD/MM/YYYY HH:mm"),
            },
          });
        })
        .catch((err) => res.status(500).json({ erro: err }));
    })
    .catch((err) => res.stats(500).json({ message: err }));
};

exports.approveComplaint = (req, res, next) => {
  // #swagger.tags = ['Avaliação']
  // #swagger.description = 'Endpoint para Atualizar um combustivel. Precisa de autorização'
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Parameters validation failed",
      errors: errors.array(),
    });
  }

  const dataTerminoPenalidade = req.body.dataTerminoPenalidade;
  const idDenuncia = req.params.idDenuncia;
  const idAdministrador = req.params.idAdministrador;

  Complaint.update(
    {
      dataInicioPenalidade: moment(),
      dataTerminoPenalidade: moment(dataTerminoPenalidade),
      idAdministrador,
      status: "Aprovada",
    },
    {
      where: {
        idDenuncia,
      },
    }
  )
    .then((complaint) => {
      return res
        .status(200)
        .json({ message: "Denuncia aprovada com sucesso", complaint });
    })
    .catch((err) => res.status(500).json({ erro: err }));
};

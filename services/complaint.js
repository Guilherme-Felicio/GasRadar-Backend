const Complaint = require("../Models/Complaint");
const Establishment = require("../Models/Establishment");
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
  const motivo = req.body.motivo;
  const idEstabelecimento = req.body.idEstabelecimento;
  const { userData } = res.locals;
  const idConsumidor = userData.idConsumidor;

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
        motivo,
        status: "PENDENTE",
        dataInicioPenalidade: null,
        dataTerminoPenalidade: null,
        dataDenuncia: moment(),
      })
        .then((complaint) => {
          return res.status(200).json({
            message: "Denuncia criada com sucesso",
            denuncia: {
              ...complaint.dataValues,
              dataDenuncia: moment(complaint.dataValues.dataDenuncia)
                .tz("America/Sao_Paulo")
                .format("DD/MM/YYYY HH:mm"),
            },
          });
        })
        .catch((err) => res.status(500).json({ erro: err }));
    })
    .catch((err) => res.status(500).json({ message: err }));
};

exports.manageComplaint = (req, res, next) => {
  // #swagger.tags = ['Denuncia']
  // #swagger.description = 'Endpoint para Aprovar/Rejeitar denuncia. Precisa de autorização'
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Parameters validation failed",
      errors: errors.array(),
    });
  }

  const status = req.body.status;
  const descricao = req.body.descricao;
  const idDenuncia = req.body.idDenuncia;
  const idAdministrador = req.params.idAdministrador;
  let idEstabelecimento;

  Complaint.update(
    {
      dataDenuncia: moment(),
      idAdministrador,
      status,
      descricao,
    },
    {
      where: {
        idDenuncia,
      },
      returning: true,
      plain: true,
    }
  )
    .then(() => {
      Complaint.findOne({ where: idDenuncia })
        .then((complaint) => {
          if (status === "REJEITADA")
            return res.status(200).json({
              message: `Denuncia Rejeitada com sucesso`,
            });

          idEstabelecimento = complaint.dataValues.idEstabelecimento;

          const dataTerminoPenalidade =
            complaint.dataValues.motivo === 1
              ? moment().add(99, "years")
              : moment(2, "days");

          Establishment.update(
            { dataTerminoPenalidade },
            {
              where: {
                idEstabelecimento,
              },
            }
          )
            .then(() => {
              return res.status(200).json({
                message: `Denuncia Aprovada com sucesso`,
              });
            })
            .catch((err) => res.status(500).json({ erro: err }));
        })
        .catch((err) => res.status(500).json({ erro: err }));
    })
    .catch((err) => res.status(500).json({ erro: err }));
};

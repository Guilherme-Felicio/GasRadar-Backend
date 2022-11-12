const Consumer = require("../Models/Consumer");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const moment = require("moment-timezone");

exports.getConsumer = (req, res, next) => {
  // #swagger.tags = ['Consumidor']
  // #swagger.description = 'Busca todas informações de um estabelecimento.'

  if (!Number.isInteger(Number(req.params.id))) {
    return res
      .status(422)
      .json({ message: "Id do estabelecimento deve ser um valor inteiro." });
  }

  const reqId = req.params.id;

  // finding Consumer

  Consumer.findOne({
    include: {
      model: User,
    },
    where: {
      idConsumidor: reqId,
    },
  }).then((consumerData) => {
    const data = {
      ...consumerData.usuario.dataValues,
      ...consumerData.dataValues,
      dataNasc: moment(consumerData.dataNasc)
        .tz("America/Sao_Paulo")
        .format("DD/MM/YYYY"),
    };
    delete data.usuario;
    delete data.idUsuario;
    delete data.senha;
    delete data.adm;

    res.status(200).json(data);
  });
};

exports.updateConsumer = (req, res, next) => {
  // #swagger.tags = ['Consumidor']
  // #swagger.description = 'atualiza os dados de um estabelecimento.  Precisa de autorização de estabelecimento'
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Parameters validation failed",
      errors: errors.array(),
    });
  }

  if (!Number.isInteger(Number(req.params.id))) {
    return res
      .status(422)
      .json({ message: "Id do estabelecimento deve ser um valor inteiro." });
  }

  const idConsumidor = req.params.id;
  const nome = req.body.nome;
  const sexo = req.body.sexo;
  const dataNasc = req.body.dataNasc;
  const endereco = req.body.endereco;
  const bairro = req.body.bairro;
  const cep = req.body.cep;
  const cidade = req.body.cidade;
  const uf = req.body.uf;

  Consumer.update(
    {
      idConsumidor,
      nome,
      endereco,
      sexo,
      dataNasc,
      bairro,
      cep,
      cidade,
      uf,
    },
    {
      where: {
        idConsumidor,
      },
    }
  )
    .then((consumidor) => {
      return res
        .status(200)
        .json({ message: "consumidor atualizado com sucesso" });
    })
    .catch((err) => res.status(500).json({ erro: err }));
};

exports.deleteConsumer = (req, res, next) => {
  // #swagger.tags = ['Consumidor']
  // #swagger.description = 'deleta um estabelecimento pelo id.  Precisa de autorização'
  if (!Number.isInteger(Number(req.params.id))) {
    return res
      .status(500)
      .json({ message: "Id do consumidor deve ser um valor inteiro." });
  }

  // token ja foi verifacado no consumerAuth

  const reqId = req.params.id;
  const token = req.get("Authorization").split(" ")[1];
  decodedToken = jwt.verify(token, "secretsecretsecret");
  const idUsuario = decodedToken.userId;
  const idConsumidor = decodedToken.consumerId;

  if (idConsumidor !== Number(reqId)) {
    return res.status(403).json({
      message:
        "usuário não possui autorização para excluir esse estabelecimento",
    });
  }

  // deleting consumer

  User.destroy({
    where: {
      idUsuario,
    },
  })
    .then((user) => {
      return res.status(200).json({
        message: "Consumidor excluido",
        user: user,
        consumer: idConsumidor,
      });
    })
    .catch((err) => res.status(500).json({ erro: err }));
};
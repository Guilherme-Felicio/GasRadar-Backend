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
      idUsuario: reqId,
    },
  })
    .then((consumerData) => {
      if (!consumerData)
        return res.status(200).json({ message: "Consumidor não encontrado" });
      const data = {
        ...consumerData.usuario.dataValues,
        ...consumerData.dataValues,
        dataNasc: moment(consumerData.dataNasc)
          .tz("America/Sao_Paulo")
          .format("DD/MM/YYYY"),
      };
      delete data.usuario;
      delete data.idConsumidor;
      delete data.senha;
      delete data.isEmailVerificado;
      delete data.codigoVerificacao;

      res.status(200).json(data);
    })
    .catch((err) => res.status(500).json({ erro: err }));
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
  const genero = req.body.genero;
  const telefone = req.body.telefone;
  const dataNasc = moment(req.body.dataNasc);
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
      genero,
      dataNasc,
      bairro,
      cep,
      cidade,
      uf,
      telefone,
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
        .json({ message: "consumidor atualizado com sucesso", consumidor });
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
  const idUsuario = decodedToken.idUsuario;
  const idConsumidor = decodedToken.idConsumidor;

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

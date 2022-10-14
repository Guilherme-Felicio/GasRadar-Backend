const Establishment = require("../Models/Establishment");
const validationResult = require("express-validator");

exports.getEstablishment = (req, res, next) => {
  Establishment.findAll({
    attributes: [
      "idEstabelecimento",
      "status",
      "endereco",
      "cidade",
      "bairro",
      "cep",
      "uf",
      "latitude",
      "longitude",
      "urlImagem",
      "nota",
    ],
  })
    .then((establishment) => {
      if (establishment.length === 0) {
        return res
          .status(404)
          .json({ message: "Estabelecimento não encontrado." });
      }

      res.status(200).json(establishment);
    })
    .catch((err) => res.status(500).json({ erro: err }));
};

exports.updateEstablishment = (req, res, next) => {
  if (!Number.isInteger(Number(req.params.id))) {
    return res.status(404).json({ message: "Estabelecimento não encontrado" });
  }

  const idEstabelecimento = req.params.id;
  const nome = req.body.nome;
  const telefone = req.body.telefone;
  const endereco = req.body.endereco;
  const bairro = req.body.bairro;
  const cep = req.body.cep;
  const cidade = req.body.cidade;
  const uf = req.body.uf;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const idBandeira = req.body.idBandeira;
  const urlImagem = req.body.urlImagem;

  Establishment.update(
    {
      nome,
      telefone,
      endereco,
      bairro,
      cep,
      cidade,
      uf,
      latitude,
      longitude,
      idBandeira,
      urlImagem,
    },
    {
      where: {
        idEstabelecimento,
      },
    }
  )
    .then((establishment) => {
      return res
        .status(200)
        .json({ message: "Estabelecimento não encontrado" });
    })
    .catch((err) => res.status(500).json({ erro: err }));
};

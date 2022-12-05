const moment = require("moment");
const Consumer = require("../Models/Consumer");
const Admin = require("../Models/Admin");
const Establishment = require("../Models/Establishment");
const multer = require("multer");

exports.uploadImage = (req, res, next) => {
  // #swagger.tags = ['Upload de Imagens']
  // #swagger.description = 'Endpoint para Subir uma imagem.'

  const idConsumidor = res.locals.userData?.idConsumidor
    ? res.locals.userData?.idConsumidor
    : null;
  const idEstabelecimento = res.locals.userData?.idEstabelecimento
    ? res.locals.userData?.idEstabelecimento
    : null;
  const idAdministrador = res.locals.userData?.idAdministrador
    ? res.locals.userData?.idAdministrador
    : null;

  console.log(idConsumidor);

  if (idEstabelecimento) {
    Establishment.update(
      { urlImage: req.file.path },
      { where: { idEstabelecimento } }
    )
      .then(() => {
        return res
          .status(200)
          .json({ message: "Imagem atualizada com sucesso!" });
      })
      .catch((err) => res.status(500).json({ erro: err }));
  } else if (idConsumidor) {
    Consumer.update({ urlImage: req.file.path }, { where: { idConsumidor } })
      .then(() => {
        return res.status(200).json({
          message: "Imagem Atualizada com sucesso!",
          path: req.file.path,
        });
      })
      .catch((err) => res.status(500).json({ erro: err }));
  } else if (idAdministrador) {
    Admin.update({ urlImage: req.file.path }, { where: { idAdministrador } })
      .then(() => {
        return res
          .status(200)
          .json({ message: "Imagem atualizada com sucesso!" });
      })
      .catch((err) => res.status(500).json({ erro: err }));
  } else res.status(500).json({ message: "Erro ao atualizar Imagem" });
};

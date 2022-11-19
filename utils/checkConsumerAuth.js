const jwt = require("jsonwebtoken");
const consumer = require("../Models/Consumer");

module.exports = (req, res, next) => {
  if (!req.get("Authorization")) {
    return res.status(401).json({ message: "Usuário não autenticado." });
  }
  const token = req.get("Authorization").split(" ")[1]; // gets the token from the header of the request
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "secretsecretsecret");
  } catch (err) {
    return res.status(500).json({ message: "Token inválido!" });
  }

  if (!decodedToken) {
    return res.status(401).json({ message: "Usuário não autenticado." });
  }

  req.idUsuario = decodedToken.idUsuario;

  consumer
    .findOne({ where: { idUsuario: req.idUsuario } })
    .then((consumer) => {
      if (consumer === null)
        return res
          .status(403)
          .json({ message: "Usuario não tem permissões necessárias" });
      next();
    })
    .catch((err) => res.status(500).json({ message: err }));
};

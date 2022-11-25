const jwt = require("jsonwebtoken");
const Admin = require("../Models/Admin");

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

  const idUsuario = decodedToken.idUsuario;

  Admin.findOne({
    where: {
      idUsuario: idUsuario,
    },
  })
    .then((admin) => {
      if (admin === null)
        return res
          .status(403)
          .json({ message: "usuário não tem permissões necessárias!" });
      res.locals.userData = { ...admin.dataValues };
      next();
    })
    .catch((err) => res.status(500).json({ message: err }));
};

const { validationResult } = require("express-validator");
const db = require("../utils/database");

exports.getFuels = (req, res, next) => {
  db.execute(`SELECT * FROM COMBUSTIVEL`)
    .then((resp) => {
      const resData = resp[0];
      res.status(200).json(resData);
    })
    .catch((err) => console.log(err));
};

exports.createFuel = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Parameters validation failed",
      errors: errors.array(),
    });
  }

  const { nome, unidade } = req.body;

  db.execute(
    `INSERT INTO combustivel (nome, unidade) VALUES (${nome}, ${unidade})`
  )
    .then((resp) => {
      console.log(resp);
      // res.status(201).json({
      //   message: "Fuel registered successfully",
      //   data: {
      //     nome,
      //     unidade,
      //   },
      // });
    })
    .catch((err) => console.log(err));
};

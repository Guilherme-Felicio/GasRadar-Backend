const express = require("express");
const bodyParser = require("body-parser");
const fuelsRoutes = require("./api/fuel");
const consumerAuthRoutes = require("./api/consumerAuth");
const establishmentAuthRoutes = require("./api/establishmentAuth");
const establishmentRotes = require("./api/establishment");
const sequelize = require("./utils/database");
const associations = require("./utils/dataBaseAssociations");

const app = express();
app.use(bodyParser.json()); // set the header for aplication/json

// set the CORS to allows the frontend to access the api from a different port
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/fuels", fuelsRoutes);
app.use("/auth/consumer", consumerAuthRoutes);
app.use("/auth/establishment", establishmentAuthRoutes);
app.use("/establishment", establishmentRotes);

associations();

sequelize
  .sync()
  .then((result) => {
    app.listen(8080);
  })
  .catch((error) => console.log(error));

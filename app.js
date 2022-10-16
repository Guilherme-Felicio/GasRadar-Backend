const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");
const sequelize = require("./utils/database");
const associations = require("./utils/dataBaseAssociations");
const fuelsRoutes = require("./routes/fuel");
const consumerAuthRoutes = require("./routes/consumerAuth");
const establishmentAuthRoutes = require("./routes/establishmentAuth");
const establishmentRotes = require("./routes/establishment");

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
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

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

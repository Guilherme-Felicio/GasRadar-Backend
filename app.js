const express = require("express");
const bodyParser = require("body-parser");
const fuelsRoutes = require("./routes/fuel");

const app = express();
app.use(bodyParser.json()); // set the header for aplication/json

// set the CORS to allows the frontend to access the api from a different port
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "content-type, authorization");
  next();
});

app.use("/fuels", fuelsRoutes);

app.listen(8080);

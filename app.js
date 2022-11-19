const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const helmet = require("helmet");

const port = process.env.PORT || 8000;
const cors = require("cors");

const router = require("./routes/index");

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("images"));

app.use(cors());
const allowlist = ["https://localhost:3000"];
const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (allowlist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

app.use("/api", cors(corsOptionsDelegate), router);
app.use("*", (req, res) => {
  res.send("Sukses");
});

app.listen(port, function (err) {
  if (err) throw err;
  console.log(`App is running on port ${port}`);
});

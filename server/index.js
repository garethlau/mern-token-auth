const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const keys = require("./config/keys");

const PORT = process.env.PORT || 5000;
const app = express();

// Models
require("./models");

// Set body to parse incoming requets
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  bodyParser.json({
    limit: "500mb",
  })
);

// Cors
const whitelist = [""];
const corsOptions = {
  origin: function (origin, callback) {
    let originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());

// Connect to mongoose
mongoose
  .connect(keys.MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    keepAlive: 1,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to mongo.");
  })
  .catch((err) => {
    console.log("Error connecting to mongo.", err);
  });

// Require routes
app.use(require("./routes"));

app.listen(PORT, () => {
  console.log("Listening on port: " + PORT);
}); // tell express to listen to the port

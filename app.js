require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "claudia cat",
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

require("./passport")(app); // This automatically requires index.js in this folder

// Express View engine setup

app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true,
    outputStyle: "compressed"
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
hbs.registerPartials(`${__dirname}/views/partials`);
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// HBS helpers
hbs.registerHelper("trimDate", function(passedString) {
  var theString = String(passedString).substring(4, 15);
  return new hbs.SafeString(theString);
});

// default value for title local
app.locals.title = "ayGre-ta";

app.use((req, res, next) => {
  res.locals.user = req.user;
  console.log("USUARIO" + req.user);
  next();
});

const index = require("./routes/index");
app.use("/", index);

module.exports = app;

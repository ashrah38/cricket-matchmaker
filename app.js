const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
app.use("/public", express.static("public"));
// Initializing bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const idCreator = require("./helper_functions/id_creator");
//////////////// USE ENV VARIABLES FOR NODEMAILER AND MONGOCONNECT

// Initializing Sessions
const expressSession = require("express-session")({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
});
app.use(expressSession);

// Initializing MongoDB
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cricketmm.r81cs.mongodb.net/userInfo?retryWrites=true&w=majority`
  )
  .then(() => console.log("UserInfo connected"))
  .catch((err) => console.log(err));

// Importing model for users
const Users = require("./models/users.js");

// Initializing passport (passport-local strategy)
app.use(passport.initialize());
app.use(passport.session());
passport.use(Users.createStrategy());
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

// Importing routes
app.use("/", require("./routes/index.js"));
app.use("/user", require("./routes/user.js"));
app.use("/user/home", require("./routes/home.js"));
app.use("/", require("./routes/forgot_pass.js"));

// Initializing the port
app.listen(3000, () => console.log("Port Init"));

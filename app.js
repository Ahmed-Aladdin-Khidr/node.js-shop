const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const csrf = require("@dr.pogodin/csurf");
const flash = require("connect-flash");
const multer = require("multer");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorsController = require("./controllers/error");

const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.g7wrqc5.mongodb.net/shop?retryWrites=true&appName=Cluster0`;

const app = express();
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const filename = new Date().toISOString() + file.originalname;
    const sanitizedFileName = filename.replace(/:/g, "-");
    cb(null, sanitizedFileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"));
app.use(express.static(path.join(__dirname, "public")));
app.use('/images', express.static(path.join(__dirname, "images")));

app.use(
  session({
    secret: "Long String Value",
    resave: false,
    saveUninitialized: false,
    store: store,
  }),
);
app.use(csrfProtection);
app.use((req, res, next) => {
  res.locals.isAuth = req.session.user_id;
  res.locals.csrfToken = req.csrfToken();
  next();
});
app.use(flash());

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.get("/500", errorsController.get500);
app.use(errorsController.get404);
app.use((error, req, res, next) => {
  console.log(error);
  res.redirect("/500");
});
mongoose
  .connect(MONGODB_URI)
  .then((r) => {
    app.listen(3000, "localhost");
  })
  .catch((e) => console.log(e));

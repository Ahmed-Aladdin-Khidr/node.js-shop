const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorsController = require("./controllers/error");

const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.g7wrqc5.mongodb.net/shop?retryWrites=true&appName=Cluster0`;

const app = express();
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "Long String Value",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorsController.get404);
mongoose
  .connect(MONGODB_URI)
  .then((r) => {
    // const user = new User({
    //   name: "Ahmed Aladdin",
    //   email: "ahmed3laa3132@gmail.com",
    //   cart: { items: [] },
    // });
    // user.save();
    app.listen(3000, "localhost");
  })
  .catch((e) => console.log(e));

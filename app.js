const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/user");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorsController = require("./controllers/error");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("695d5d59b09c32a3886f6e5b")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorsController.get404);
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.g7wrqc5.mongodb.net/shop?retryWrites=true&appName=Cluster0`
  )
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

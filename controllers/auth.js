const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuth: req.session.user_id,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("695d5d59b09c32a3886f6e5b")
    .then((user) => {
      req.user = user;
      req.session.user_id = user._id.toString();
      req.session.save(e=>{
          res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((e) => {
    res.redirect("/");
  });
};

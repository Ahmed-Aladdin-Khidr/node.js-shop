const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuth: req.session.user_id,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.user = user;
            req.session.user_id = user._id.toString();
            return req.session.save((e) => {
              res.redirect("/");
            });
          }
          res.redirect("/login");
        })
        .catch((error) => console.log(error));
    })
    .catch((err) => console.log(err));
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuth: false,
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmedPassword = req.body.confirmedPassword;
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((r) => {
          res.redirect("/login");
        });
    })
    .catch((e) => console.log(e));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((e) => {
    res.redirect("/");
  });
};

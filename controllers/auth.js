const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_LOGIN,
    pass: process.env.SMTP_KEY,
  },
  tls: {
    // This allows the connection even if the certificate is not trusted
    rejectUnauthorized: false,
  },
});

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  message = message.length > 0 ? message[0] : null;
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password.");
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
  let message = req.flash("error");
  message = message.length > 0 ? message[0] : null;
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuth: false,
    errorMessage: message,
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmedPassword = req.body.confirmedPassword;
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        req.flash("error", "E-Mail exists already.");
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
          transporter
            .sendMail({
              from: "shop@aladdinpop.com",
              to: email,
              subject: "Signup Succeeded!",
              html: "<h1>You have successfully signedup!</h1>",
            })
            .catch((e) => console.log(e));
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

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  message = message.length > 0 ? message[0] : null;
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          // req.flash('error', 'No account with that email found.');
          return res.redirect("/login");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save().then((result) => {
          transporter
            .sendMail({
              from: "shop@aladdinpop.com",
              to: req.body.email,
              subject: "Password Reset",
              html: `
                <p>You requested a password reset.</p>
                <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
              `,
            })
            .catch((e) => console.log(e));
          return res.redirect("/login");
        });
      })
      .catch((e) => console.log(e));
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      if (user){
        let message = req.flash("error");
        message = message.length > 0 ? message[0] : null;
        return res.render("auth/new-password", {
          path: "/new-password",
          pageTitle: "New Password",
          errorMessage: message,
          userId: user._id.toString(),
          passwordToken: token,
        });
      }
      return res.redirect('/login');
    })
    .catch((e) => console.log(e));
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((e) => console.log(e));
};

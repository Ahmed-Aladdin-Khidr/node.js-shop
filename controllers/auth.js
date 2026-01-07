exports.getLogin = (req, res, next) => {
    const cookies = req.get("Cookie").split(';').reduce((res, c) => {
        const [key, val] = c.trim().split('=').map(decodeURIComponent);
        res[key] = val;
        return res;
    }, {});
  const loginCookie = cookies['loggedIn'] === 'true';
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: loginCookie,
  });
};

exports.postLogin = (req, res, next) => {
  res.setHeader("Set-Cookie", "loggedIn=true");
  res.redirect("/");
};

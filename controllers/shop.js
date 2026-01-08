const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Shop",
        path: "/products",
        isAuth: req.session.user_id,
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        pageTitle: product.title,
        path: "/products",
        product,
        isAuth: req.session.user_id,
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        isAuth: req.session.user_id,
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  User.findById(req.session.user_id)
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
        isAuth: req.session.user_id,
      });
    })
    .catch((e) => console.log(e));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return User.findById(req.session.user_id).then((user) => {
        return user.addToCart(product);
      });
    })
    .then((r) => {
      res.redirect("/cart");
    })
    .catch((e) => console.log(e));
};

exports.postDeleteCartItem = (req, res, next) => {
  User.findById(req.session.user_id)
    .then((user) => {
      return user.deleteCartItem(req.body.productId);
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((e) => console.log(e));
};

exports.postOrder = (req, res, next) => {
  let userMongooseObject;
  User.findById(req.session.user_id)
    .populate("cart.items.productId")
    .then((user) => {
      userMongooseObject = user;
      const products = user.cart.items.map((i) => {
        return { product: { ...i.productId._doc }, quantity: i.quantity };
      });
      const order = new Order({
        products: products,
        user: {
          name: user.name,
          userId: user,
        },
      });
      return order.save();
    })
    .then((r) => {
      return userMongooseObject.clearCart();
    })
    .then((r) => {
      res.redirect("/orders");
    })
    .catch((e) => console.log(e));
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.session.user_id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
        isAuth: req.session.user_id,
      });
    })
    .catch((e) => console.log(e));
};

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     pageTitle: "Checkout",
//   });
// };

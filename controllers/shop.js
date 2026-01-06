const Product = require("../models/product");
// const User = require("../models/user");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Shop",
        path: "/products",
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
      });
    })
    .catch((err) => console.log(err));
};

// exports.getCart = (req, res, next) => {
//   req.user
//     .getCart()
//     .then((products) => {
//       res.render("shop/cart", {
//         path: "/cart",
//         pageTitle: "Your Cart",
//         products: products,
//       });
//     })
//     .catch((e) => console.log(e));
// };

// exports.postCart = (req, res, next) => {
//   const prodId = req.body.productId;
//   Product.findById(prodId)
//     .then((product) => {
//       return req.user.addToCart(product);
//     })
//     .then((r) => {
//       res.redirect("/cart");
//     })
//     .catch((e) => console.log(e));
// };

// exports.postDeleteCartItem = (req, res, next) => {
//   req.user
//     .deleteCartItem(req.body.productId)
//     .then((result) => {
//       res.redirect("/cart");
//     })
//     .catch((e) => console.log(e));
// };

// exports.postOrder = (req, res, next) => {
//   req.user
//     .addOrder()
//     .then((r) => {
//       res.redirect("/orders");
//     })
//     .catch((e) => console.log(e));
// };

// exports.getOrders = (req, res, next) => {
//   req.user
//     .getOrders()
//     .then((orders) => {
//       res.render("shop/orders", {
//         path: "/orders",
//         pageTitle: "Your Orders",
//         orders: orders
//       });
//     })
//     .catch((e) => console.log(e));
// };

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     pageTitle: "Checkout",
//   });
// };

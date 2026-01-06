// const Product = require("../models/product");

// exports.getEditProduct = (req, res, next) => {
//   const editMode = req.query.edit;
//   if (!editMode) {
//     return res.render("admin/edit-product", {
//       pageTitle: "Add Product",
//       path: "/admin/edit-product",
//       editing: false,
//     });
//   }
//   const prodId = req.params.productId;

//   Product.findById(prodId)
//     .then((prod) => {
//       if (!prod) {
//         return res.redirect("/");
//       }
//       res.render("admin/edit-product", {
//         pageTitle: "Edit Product",
//         path: "/admin/edit-product",
//         editing: editMode,
//         product: prod,
//       });
//     })
//     .catch((e) => console.log(e));
// };

// exports.postAddProduct = (req, res, next) => {
//   const product = new Product(
//     req.body.title,
//     req.body.price,
//     req.body.description,
//     req.body.imageUrl,
//     null, 
//     req.user._id
//   );
//   product
//     .save()
//     .then(() => {
//       res.redirect("/admin/products");
//     })
//     .catch((err) => console.log(err));
// };

// exports.postEditProduct = (req, res, next) => {
//   const product = new Product(
//     req.body.title,
//     req.body.price,
//     req.body.description,
//     req.body.imageUrl,
//     req.body.productId,
//     req.user._id
//   );
//   product
//     .save()
//     .then((r) => {
//       res.redirect("/admin/products");
//     })
//     .catch((e) => console.log(e));
// };

// exports.postDeleteProduct = (req, res, next) => {
//   Product.deleteById(req.body.productId)
//     .then((r) => {
//       res.redirect("/admin/products");
//     })
//     .catch((e) => console.log(e));
// };

// exports.getProducts = (req, res, next) => {
//   Product.fetchAll()
//     .then((products) => {
//       res.render("admin/products", {
//         prods: products,
//         pageTitle: "Admin Products",
//         path: "/admin/products",
//       });
//     })
//     .catch((e) => console.log(e));
// };

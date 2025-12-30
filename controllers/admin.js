const Product = require("../models/product");

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/edit-product",
      editing: false,
    });
  }
  const prodId = req.params.productId;

  // req.user.getProducts({where: {id: prodId}})
  //   .then((prods) => {
  //     const prod = prods[0];
  //     if (!prod) {
  //       return res.redirect("/");
  //     }
  //     res.render("admin/edit-product", {
  //       pageTitle: "Edit Product",
  //       path: "/admin/edit-product",
  //       editing: editMode,
  //       product: prod,
  //     });
  //   })
  //   .catch((e) => console.log(e));
};

exports.postAddProduct = (req, res, next) => {
   const product = new Product(
    req.body.title,
    req.body.price,
    req.body.imageUrl,
    req.body.description
  );
  product.save()
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

// exports.postEditProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   Product.findByPk(prodId)
//     .then((product) => {
//       product.title = req.body.title;
//       product.imageUrl = req.body.imageUrl;
//       product.description = req.body.description;
//       product.price = req.body.price;
//       return product.save();
//     })
//     .then((r) => {
//       res.redirect("/admin/products");
//     })
//     .catch((e) => console.log(e));
// };

// exports.postDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   // Cart.deleteProduct(prodId, () => {
//   //   Product.delete(prodId, () => {
//   //     res.redirect("/admin/products");
//   //   });
//   // });
//   Product.findByPk(prodId)
//     .then((product) => {
//       return product.destroy();
//     })
//     .then((r) => {
//       res.redirect("/admin/products");
//     })
//     .catch((e) => console.log(e));
// };

// exports.getProducts = (req, res, next) => {
//   req.user.getProducts()
//     .then((products) => {
//       res.render("admin/products", {
//         prods: products,
//         pageTitle: "Admin Products",
//         path: "/admin/products",
//       });
//     })
//     .catch((e) => console.log(e));
// };

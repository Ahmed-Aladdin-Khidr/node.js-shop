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

  Product.findById(prodId)
    .then((prod) => {
      if (!prod) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: prod,
      });
    })
    .catch((e) => console.log(e));
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    userId: req.session.user_id,
  });
  product
    .save()
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (product.userId.toString() !== req.session.user_id) {
        return res.redirect("/");
      }
      product.title = req.body.title;
      product.price = req.body.price;
      product.description = req.body.description;
      product.imageUrl = req.body.imageUrl;
      return product.save().then((r) => {
        res.redirect("/admin/products");
      });
    })
    .catch((e) => console.log(e));
};

exports.postDeleteProduct = (req, res, next) => {
  Product.deleteOne({ _id: req.body.productId, userId: req.user._id })
    .then((r) => {
      res.redirect("/admin/products");
    })
    .catch((e) => console.log(e));
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.session.user_id })
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((e) => console.log(e));
};

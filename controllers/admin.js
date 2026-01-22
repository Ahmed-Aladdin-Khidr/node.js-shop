const { validationResult } = require("express-validator");
const fileHelper = require("../util/file");
const Product = require("../models/product");
const {adminViewSettings} = require('../data/settings');

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/edit-product",
      editing: false,
      hasError: false,
      errorMessage: undefined,
      validationErrors: [],
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
        hasError: false,
        errorMessage: undefined,
        validationErrors: [],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postAddProduct = (req, res, next) => {
  if (!req.file) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
      },
      errorMessage: "Attached file is not an image.",
      validationErrors: [],
    });
  }
  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    imageUrl: "/" + req.file.path,
    userId: req.session.user_id,
  });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/add-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  product
    .save()
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const image = req.file;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      product: {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        _id: req.body.productId,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }
  Product.findById(req.body.productId)
    .then((product) => {
      if (product.userId.toString() !== req.session.user_id) {
        return res.redirect("/");
      }
      product.title = req.body.title;
      product.price = req.body.price;
      product.description = req.body.description;
      if (image) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = "/" + req.file.path;
      }
      return product.save().then((r) => {
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  Product.findById(req.body.productId)
    .then((prod) => {
      if (!prod) {
        return next(new Error("Product was not found."));
      }
      fileHelper.deleteFile(prod.imageUrl);
      return Product.deleteOne({
        _id: req.body.productId,
        userId: req.session.user_id,
      });
    })
    .then((r) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems = 0;

  Product.find({ userId: req.session.user_id })
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * adminViewSettings.itemsPerPage)
        .limit(adminViewSettings.itemsPerPage);
    })
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        currentPage: page,
        hasNextPage: adminViewSettings.itemsPerPage * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / adminViewSettings.itemsPerPage),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

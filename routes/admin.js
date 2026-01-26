const express = require("express");
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator");
const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getEditProduct);

// /admin/add-product => POST
router.post(
  "/add-product",
  isAuth,
  [
    body("title", "Title must be min 3.").isString().isLength({ min: 3 }).trim(),
    body("price", "Price must be a float number.").isFloat(),
    body("description", "Description must be min 5 and max 400 characters.").isLength({ min: 5, max: 400 }).trim(),
  ],
  adminController.postAddProduct
);

// // /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  isAuth,
  [
    body("title", "Title must be alphanumeric with min 3.").isString().isLength({ min: 3 }).trim(),
    body("price", "Price must be a float number.").isFloat(),
    body("description", "Description must be min 5 and max 400 characters.").isLength({ min: 5, max: 400 }).trim(),
  ],
  adminController.postEditProduct
);

router.delete("/product/:productId", isAuth, adminController.deleteProduct);

module.exports = router;

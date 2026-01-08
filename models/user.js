const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  let updatedCart = { items: [] };
  if (this.cart && this.cart.items.length > 0) {
    const cartProduct = this.cart.items.findIndex((cp) => {
      return String(cp.productId) == String(product._id);
    });
    if (cartProduct != -1) {
      this.cart.items[cartProduct].quantity += 1;
    } else {
      this.cart.items.push({ productId: product._id, quantity: 1 });
    }
    updatedCart = this.cart;
  } else {
    updatedCart = { items: [{ productId: product._id, quantity: 1 }] };
  }
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.deleteCartItem = function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

// const { getDb } = require("../util/database");
// const mongodb = require("mongodb");

// const ObjectId = mongodb.ObjectId;

// class User {
//   constructor(userName, email, cart, _id) {
//     this.userName = userName;
//     this.email = email;
//     this.cart = cart;
//     this._id = _id ? new ObjectId(_id) : null;
//   }

//   save() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);
//   }

//   addToCart(product) {
//     let updatedCart = { items: [], total: 0 };
//     if (this.cart && this.cart.items.length > 0) {
//       const cartProduct = this.cart.items.findIndex((cp) => {
//         return String(cp.productId) == String(product._id);
//       });
//       if (cartProduct != -1) {
//         this.cart.items[cartProduct].quantity += 1;
//       } else {
//         this.cart.items.push({ productId: product._id, quantity: 1 });
//       }
//       updatedCart = this.cart;
//     } else {
//       updatedCart = { items: [{ productId: product._id, quantity: 1 }] };
//     }
//     // console.log(this, updatedCart);
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   getCart() {
//     const db = getDb();
//     let productIds = [];
//     if (this.cart) {
//       if (Array.isArray(this.cart.items)) {
//         productIds = this.cart.items.map((i) => i.productId);
//       }
//     }
//     db.collection("products")
//       .find()
//       .toArray()
//       .then((products) => {
//         // 1. Create a Set of IDs from the products array (for O(1) lookup speed)
//         const existingProductIds = new Set(
//           products.map((p) => p._id.toString())
//         );
//         // 2. Filter the cart: only keep items whose productId IS in the existing list
//         const updatedCartItems = this.cart.items.filter((item) =>
//           existingProductIds.has(item.productId.toString())
//         );

//         this.cart.items = updatedCartItems;

//         db.collection("users").updateOne(
//           { _id: new ObjectId(this._id) },
//           { $set: { "cart.items": updatedCartItems } }
//         );
//       });
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         return products.map((p) => {
//           return {
//             ...p,
//             quantity: this.cart.items.find(
//               (i) => i.productId.toString() === p._id.toString()
//             ).quantity,
//           };
//         });
//       });
//   }

//   deleteCartItem(productId) {
//     const updatedCartItems = this.cart.items.filter((item) => {
//       return String(item.productId) !== productId;
//     });
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             userName: this.userName,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then((result) => {
//         this.cart = { items: [] };
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: { items: { items: [] } } } }
//           );
//       });
//   }

//   getOrders() {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({ "user._id": new ObjectId(this._id) })
//       .toArray();
//   }

//   static findById(_id) {
//     const db = getDb();
//     return db.collection("users").findOne({ _id: new ObjectId(_id) });
//   }
// }

// module.exports = User;

const { getDb } = require("../util/database");
const mongodb = require("mongodb");

const ObjectId = mongodb.ObjectId;

class User {
  constructor(userName, email, cart, _id) {
    this.userName = userName;
    this.email = email;
    this.cart = cart;
    this._id = _id ? new ObjectId(_id) : null;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    let updatedCart = { items: [], total: 0 };
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
    // console.log(this, updatedCart);
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((i) => i.productId);
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((p) => {
          return {
            ...p,
            quantity: this.cart.items.find(
              (i) => i.productId.toString() === p._id.toString()
            ).quantity,
          };
        });
      });
  }

  static findById(_id) {
    const db = getDb();
    return db.collection("users").findOne({ _id: new ObjectId(_id) });
  }
}

module.exports = User;

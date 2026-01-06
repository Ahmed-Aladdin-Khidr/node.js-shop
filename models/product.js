const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Product', productSchema);

// const mongodb = require("mongodb");
// const getDb = require("../util/database").getDb;
// const ObjectId = mongodb.ObjectId;

// class Product {
//   constructor(title, price, description, imageUrl, _id, userId) {
//     this._id = _id ? new ObjectId(_id) : null;
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this.userId = userId;
//   }

//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       // Update Product
//       dbOp = db
//         .collection("products")
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       dbOp = db.collection("products").insertOne(this);
//     }
//     return dbOp
//       .then((result) => {
//         console.log(result);
//         return result;
//       })
//       .catch((e) => console.log(e));
//   }

//   static fetchAll() {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then((products) => {
//         return products;
//       })
//       .catch((e) => console.log(e));
//   }

//   static findById(prodId) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find({ _id: new ObjectId(prodId) })
//       .next()
//       .then((product) => product)
//       .catch((e) => console.log(e));
//   }

//   static deleteById(_id) {
//     const db = getDb();
//     return db.collection("products")
//       .deleteOne({ _id: new ObjectId(_id) })
//       .then((r) => r)
//       .catch((e) => console.log(e));
//   }
// }

// module.exports = Product;

const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.g7wrqc5.mongodb.net/shop?retryWrites=true&appName=Cluster0`;

let _db;
const mongoConnect = () => {
  MongoClient.connect(uri)
    .then((client) => {
      console.log("MongoDB is connected!");
      _db = client.db();
      callback();
    })
    .catch((e) => {
      console.log(e);
      throw e;
    });
};

const getDb=() =>{
  if(_db){
    return _db;
  }
  throw "No database found!";
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

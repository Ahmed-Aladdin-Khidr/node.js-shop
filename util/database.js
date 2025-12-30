const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.g7wrqc5.mongodb.net/?appName=Cluster0`;

const mongoConnect = (callback) => {
  MongoClient.connect(uri)
    .then((client) => {
      console.log('MongoDB is connected!');
      callback(client);
    })
    .catch((e) => console.log(e));
};
module.exports = mongoConnect;
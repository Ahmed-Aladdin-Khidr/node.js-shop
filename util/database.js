const Sequelize = require("sequelize");

const sequelize = new Sequelize("node_shop_app", "root", "root", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
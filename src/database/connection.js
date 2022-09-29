const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_SENHA,{
    dialect: "mysql",
    host: process.env.DB_HOST,
    port: 3306
});

module.exports = {
    Sequelize,
    sequelize
}
const {Sequelize, sequelize} = require('../connection');

const User = sequelize.define('User', {
    username:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    senha:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = User;
const {Sequelize, sequelize} = require('../connection');
const Users = require('./Users');

const Ask = sequelize.define('ask', {
    ask:{
        type: Sequelize.TEXT,
        allowNull: false
    },
    answer:{
        type: Sequelize.TEXT,
        defaultValue: ''
    },
    id_user:{
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

Ask.belongsTo(Users, {
    foreignKey:{
        name: 'id_user'
    }
})



module.exports = Ask;
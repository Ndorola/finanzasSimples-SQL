const Sequelize = require('sequelize')

const database = new Sequelize('finanzassimples', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = database
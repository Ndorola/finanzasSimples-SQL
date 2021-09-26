const Sequelize = require('sequelize')
const db = require('../config/database')

const Usuario = db.define('usuario', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nombre: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        isEmail: true,
    },
    contrasenia: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = Usuario
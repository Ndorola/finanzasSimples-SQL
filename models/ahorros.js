const Sequelize = require('sequelize')
const db = require('../config/database')

const Ahorro = db.define('ahorro', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    categoria: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descripcion: {
        type: Sequelize.STRING,
        allowNull: false
    },
    monto: {
        type: Sequelize.STRING,
        allowNull: false
    },
    fecha: {
        type: Sequelize.STRING,
        allowNull: false
    },
})

module.exports = Ahorro
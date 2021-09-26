const Sequelize = require('sequelize')
const db = require('../config/database')

const Gasto = db.define('gasto', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    tipo: {
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

module.exports = Gasto
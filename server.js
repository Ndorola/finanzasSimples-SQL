const express = require('express')
const router = require('./routes/index')
const session = require('express-session')
require('dotenv').config()
const path = require('path')
const database = require('./config/database')
const Sequelize = require('sequelize')

const Ingreso = require('./models/ingresos')
const Gasto = require('./models/gastos')
const Ahorro = require('./models/ahorros')
const Usuario = require('./models/usuario')

const  SequelizeStore  =  require ( "connect-session-sequelize" )(session.Store)

const store = new SequelizeStore({
    db: database
})

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(
    session({
        secret:process.env.FRASE,
        store:store,
        resave:false,
        saveUninitialized:false,
        proxy:true
    })
)
store.sync()

Ingreso.belongsTo(Usuario)
Gasto.belongsTo(Usuario)
Ahorro.belongsTo(Usuario)

Usuario.hasMany(Ingreso, {onDelete: 'CASCADE'})
Usuario.hasMany(Gasto)
Usuario.hasMany(Ahorro)

database.sync()
.then(() => {
    app.use('/', router)
    app.listen(4000, () => console.log('Server listening on port 4000'))
})

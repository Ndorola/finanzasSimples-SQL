const path = require('path')
const Ingreso = require('../models/ingresos')
const Gasto = require('../models/gastos')
const Ahorro = require('../models/ahorros')

const finanzasControllers = {

    home: (req, res) => {
        try {
            res.render('index', {
                title: 'Bienvenido!',
                loggedIn: req.session.loggedIn,
                nombre: req.session.nombre || 'desconocido'
            })
        } catch {
            res.render('error404', {
                title: 'error404'
            })
        }
    },

    explicacion: (req, res) => {
        try {
            res.render('comofunciona', {
                title: '¿Cómo funciona?',
                loggedIn: req.session.loggedIn,
                nombre: req.session.nombre || 'desconocido'
            })
        } catch {
            res.render('error404', {
                title: 'error404'
            })
        }
    },

    recomendacion: (req, res) => {
        if(req.session.loggedIn) {
            return res.render('recomendacion', {
                title: 'Regla 50/30/20',
                loggedIn: req.session.loggedIn,
                nombre: req.session.nombre
            })
        }
        res.render('error404', {
            title: 'error404'
        })
    },

    error404: (req, res) => {
        res.render('error404', {
            title: 'error404'
        })
    },

    finanzas: async (req, res) => {
        let ingresos = await Ingreso.findAll({where: {usuarioId: req.session.usuarioId}})
        let gastos = await Gasto.findAll({where: {usuarioId: req.session.usuarioId}})
        let ahorros = await Ahorro.findAll({where: {usuarioId: req.session.usuarioId}})
        let fijos = await Gasto.findAll({where: {usuarioId: req.session.usuarioId, tipo: "Fijo"}})
        let variables = await Gasto.findAll({where: {usuarioId: req.session.usuarioId, tipo: "Variable"}})
        if(req.session.loggedIn) {
            return res.render('misFinanzas', {
                title: 'Mis finanzas',
                loggedIn: req.session.loggedIn,
                usuarioId: req.session.usuarioId,
                nombre: req.session.nombre || 'desconocido',
                email: req.session.email,
                usuario: req.session.usuario,
                ingresos,
                gastos,
                ahorros,
                fijos,
                variables,
            })
        }
        res.render('error404', {
            title: 'error404'
        })
    },

    ingresos: async (req, res) => {
        if(req.session.loggedIn) {
            try {
                const ingresos = await Ingreso.findAll({where: {usuarioId: req.session.usuarioId}})
                res.render('ingresos', {
                title: 'Panel ingresos',
                ingresos,
                error: null,
                editar: false,
                loggedIn: req.session.loggedIn,
                usuarioId: req.session.usuarioId,
                nombre: req.session.nombre || 'desconocido',
                email: req.session.email,
                usuario: req.session.usuario,
            })
            } catch(e) {
                console.log(e)
                res.render('error404', {
                    title: 'error404'
                })
            }
        } else {
            res.render('error404', {
                title: 'error404'
            })
        }
    },

    registrarIngreso: async (req, res) => {
        if(!req.body.id) {
            let nuevoIngreso = new Ingreso({
                categoria: req.body.categoria,
                descripcion: req.body.descripcion,
                monto: req.body.monto,
                fecha: req.body.fecha,
                usuarioId: req.body.usuarioId,
            })
            try {
                await nuevoIngreso.save()
                res.redirect('/ingresos')
            } catch (e) {
                res.render('ingresos', {
                    title: 'Panel ingresos',
                    error: e,
                    loggedIn: req.session.loggedIn,
                    usuarioId: req.session.usuarioId,
                    nombre: req.session.nombre || 'desconocido',
                    email: req.session.email,
                    usuario: req.session.usuario,
                })
            }
        } else {
            try {
                const {categoria, descripcion, monto, fecha, id} = req.body
                let ingresoEditado = await Ingreso.update({...req.body, categoria, descripcion, monto, fecha}, {where: {id: id}})
                console.log(ingresoEditado)
                res.redirect('/ingresos')
            } catch(e) {
                console.log(e)
                res.render('error404', {
                    title: 'error404'
                })
            }
        }
    },

    borrarIngreso: async (req, res) => {
        try {
            let ingreso = await Ingreso.findByPk(req.params.id)
            ingreso.destroy()
            res.redirect('/ingresos')
        } catch(e) {
            console.log(e)
            res.render('error404', {
                title: 'error404'
            })
        }
    },

    editarIngreso: async (req, res) => {
        try {
            let ingreso = await Ingreso.findByPk(req.params.id)
            res.render('ingresos', {
                title: 'Panel ingresos',
                error: null,
                editar: true,
                ingreso,
                loggedIn: req.session.loggedIn,
                usuarioId: req.session.usuarioId,
                nombre: req.session.nombre || 'desconocido',
                email: req.session.email,
                usuario: req.session.usuario,
            })
        } catch(e) {
            console.log(e)
            res.render('error404', {
                title: 'error404'
            })
        }
    },

    gastos: async (req, res) => {
        if(req.session.loggedIn) {
            try {
                const gastos = await Gasto.findAll({where: {usuarioId: req.session.usuarioId}})
                res.render('gastos', {
                title: 'Panel gastos',
                gastos,
                error: null,
                editar: false,
                loggedIn: req.session.loggedIn,
                usuarioId: req.session.usuarioId,
                nombre: req.session.nombre || 'desconocido',
                email: req.session.email,
                usuario: req.session.usuario,
            })
            } catch(e) {
                console.log(e)
                res.render('error404', {
                    title: 'error404'
                })
            }
        } else {
            res.render('error404', {
                title: 'error404'
            })
        }
    },

    registrarGasto: async (req, res) => {
        if(!req.body.id) {
            let nuevoGasto = await new Gasto({
                tipo: req.body.tipo,
                descripcion: req.body.descripcion,
                monto: req.body.monto,
                fecha: req.body.fecha,
                usuarioId: req.body.usuarioId,
            })
            try {
                await nuevoGasto.save()
                res.redirect('/gastos')
            } catch (e) {
                res.render('gastos', {
                    title: 'Panel gastos',
                    error: e,
                    loggedIn: req.session.loggedIn,
                    usuarioId: req.session.usuarioId,
                    nombre: req.session.nombre || 'desconocido',
                    email: req.session.email,
                    usuario: req.session.usuario,
                })
            }
        } else {
            try {
                const {tipo, descripcion, monto, fecha, id} = req.body
                let gastoEditado = await Gasto.update({...req.body, tipo, descripcion, monto, fecha}, {where: {id: id}})
                console.log(gastoEditado)
                res.redirect('/gastos')
            } catch(e) {
                console.log(e)
                res.render('error404', {
                    title: 'error404'
                })
            }
        }
    },

    borrarGasto: async (req, res) => {
        try {
            let gasto = await Gasto.findByPk(req.params.id)
            gasto.destroy()
            res.redirect('/gastos')
        } catch(e) {
            console.log(e)
            res.render('error404', {
                title: 'error404'
            })
        }
    },

    editarGasto: async (req, res) => {
        try {
            let gasto = await Gasto.findByPk(req.params.id)
            res.render('gastos', {
                title: 'Panel gastos',
                error: null,
                editar: true,
                gasto,
                loggedIn: req.session.loggedIn,
                usuarioId: req.session.usuarioId,
                nombre: req.session.nombre || 'desconocido',
                email: req.session.email,
                usuario: req.session.usuario,
            })
        } catch(e) {
            console.log(e)
            res.render('error404', {
                title: 'error404'
            })
        }
    },

    ahorros: async (req, res) => {
        if(req.session.loggedIn) {
            try {
                const ahorros = await Ahorro.findAll({where: {usuarioId: req.session.usuarioId}})
                res.render('ahorros', {
                title: 'Panel ahorros',
                ahorros,
                error: null,
                editar: false,
                loggedIn: req.session.loggedIn,
                usuarioId: req.session.usuarioId,
                nombre: req.session.nombre || 'desconocido',
                email: req.session.email,
                usuario: req.session.usuario,
            })
            } catch(e) {
                console.log(e)
                res.render('error404', {
                    title: 'error404'
                })
            }
        } else {
            res.render('error404', {
                title: 'error404'
            })
        }
    },

    registrarAhorro: async (req, res) => {
        if(!req.body.id) {
            let nuevoAhorro = await new Ahorro({
                categoria: req.body.categoria,
                descripcion: req.body.descripcion,
                monto: req.body.monto,
                fecha: req.body.fecha,
                usuarioId: req.body.usuarioId,
            })
            try {
                await nuevoAhorro.save()
                res.redirect('/ahorros')
            } catch (e) {
                res.render('ahorros', {
                    title: 'Panel ahorros',
                    error: e,
                    loggedIn: req.session.loggedIn,
                    usuarioId: req.session.usuarioId,
                    nombre: req.session.nombre || 'desconocido',
                    email: req.session.email,
                    usuario: req.session.usuario,
                })
            }
        } else {
            try {
                const {categoria, descripcion, monto, fecha, id} = req.body
                let ahorroEditado = await Ahorro.update({...req.body, categoria, descripcion, monto, fecha}, {where: {id: id}})
                console.log(ahorroEditado)
                res.redirect('/ahorros')
            } catch(e) {
                console.log(e)
                res.render('error404', {
                    title: 'error404'
                })
            }
        }
    },

    borrarAhorro: async (req, res) => {
        try {
            let ahorro = await Ahorro.findByPk(req.params.id)
            ahorro.destroy()
            res.redirect('/ahorros')
        } catch(e) {
            console.log(e)
            res.render('error404', {
                title: 'error404'
            })
        }
    },

    editarAhorro: async (req, res) => {
        try {
            let ahorro = await Ahorro.findByPk(req.params.id)
            res.render('ahorros', {
                title: 'Panel ahorros',
                error: null,
                editar: true,
                ahorro,
                loggedIn: req.session.loggedIn,
                usuarioId: req.session.usuarioId,
                nombre: req.session.nombre || 'desconocido',
                email: req.session.email,
                usuario: req.session.usuario,
            })
        } catch(e) {
            console.log(e)
            res.render('error404', {
                title: 'error404'
            })
        }
    },
    
    nuevoMes: async (req, res) => {
        if(req.session.loggedIn) {
            await Ingreso.destroy({where: {usuarioId: req.session.usuarioId}})
            await Gasto.destroy({where: {usuarioId: req.session.usuarioId}})
            await Ahorro.destroy({where: {usuarioId: req.session.usuarioId}})

            res.render('misFinanzas', {
                title: 'Mis finanzas',
                loggedIn: req.session.loggedIn,
                usuarioId: req.session.usuarioId,
                nombre: req.session.nombre || 'desconocido',
                email: req.session.email,
                usuario: req.session.usuario,
                ingresos: null,
                gastos: null,
                ahorros: null,
                fijos: null,
                variables: null,
            })
            return redirect('/misfinanzas')
        }
        res.render('error404', {
            title: 'error404'
        })
    }
}

module.exports = finanzasControllers
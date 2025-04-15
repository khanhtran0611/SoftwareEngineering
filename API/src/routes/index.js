const afterLogged = require('./AfterLogged.js')
const login = require('./Logging.js')
function route(app){
    app.use('/:user_id',afterLogged)
    app.use('/',login)
}

module.exports = route;

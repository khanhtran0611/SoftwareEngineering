const afterLogged = require('./CustomerLogged.js')
const login = require('./Logging.js')
const hotelRoutes = require('./hotel.routes')
const addHotelRoute = require('./AddHotel')
const roomRoutes = require('./RoomRoutes')
const bookingRoutes = require('./BookingRoutes')
const DestinationRoutes = require('./DestinationRoutes')

function route(app){
    app.use('/api/hotels', hotelRoutes)
    app.use('/api', addHotelRoute)
    app.use('/api', roomRoutes)
    app.use('/api', bookingRoutes)
    app.use('/customer',afterLogged)
    app.use('/',login)
    app.use('/destinations', DestinationRoutes)
}

module.exports = route;

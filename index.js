const express = require('express')
const path = require('path')
const app = express()
const morgan = require('morgan')
const route = require('./src/routes/index.js')
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require('method-override')
const port = 3000
app.set('views','src\\views');
app.set('view engine','ejs');
app.use(morgan('combined'))
app.use(express.static(path.join(__dirname,'src/public/')))
app.use(express.json())
app.use(express.urlencoded({
    extended : true
}))
// app.get('/',(req,res)=>{
//     res.render("Hello world");
// })

app.use(methodOverride('_method'))
route(app)
app.listen(port,()=>console.log(`Example app listening at path http://localhost:${port}`))
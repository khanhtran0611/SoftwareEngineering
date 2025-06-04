const express = require('express')
const path = require('path')
const cors = require('cors')
const app = express()
const morgan = require('morgan')
const route = require('./src/routes/index.js')
const expressLayouts = require("express-ejs-layouts");
const multer = require('multer');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const port = 5000
require('dotenv').config();
app.set('views', 'src\\views');
app.set('view engine', 'ejs');


// Cấu hình CORS
app.use(cors({
  origin: '*', // Cho phép tất cả các domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Các phương thức được phép
  allowedHeaders: ['Content-Type', 'Authorization'] // Các header được phép
}));

app.use(morgan('combined'))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'src/public/')))
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
// app.get('/',(req,res)=>{
//     res.render("Hello world");
// })

app.use(methodOverride('_method'))
console.log('Looking for .env at:', path.resolve(process.cwd(), '.env'));
const storage = multer.diskStorage({
  destination: './img/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });
route(app)
app.listen(port, () => console.log(`Example app listening at path http://localhost:${port}`))
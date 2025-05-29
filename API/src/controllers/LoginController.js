const pool = require('../config/db/index.js')
const queries = require('../config/db/queries.js')
const jwt = require('jsonwebtoken');
require('dotenv').config()



class LoginController {
  AddNewCustomerAccount(req, res) {
    let name = req.body.name
    let email = req.body.email
    let phone_number = req.body.phone_number
    let gender = req.body.gender
    let date_of_birth = req.body.date_of_birth
    let password = req.body.password

    if (!name || !email || !phone_number || !gender || !date_of_birth || !password) {
      return res.status(500).json({ status: 2, message: "Please fill all of your information" });
    }

    if (gender != 'male' && gender != 'female') {
      return res.status(500).json({
        status: 2,
        message: "We only accept male or female !"
      })
    }

    if (!this.isValidDate(date_of_birth)) {
      return res.status(500).json({
        status: 2,
        message: "Please return a valid date of birth"
      })
    }

    if (!this.isEmail(email)) {
      return res.status(500).json({
        status: 2,
        message: "Please enter a valid email !"
      })
    }

    if (!this.isValidDate(date_of_birth)) {
      return res.status(500).json({
        status: 2,
        message: "Please enter a valid date of birth !"
      })
    }

    pool.query(queries.signin, [name, email, phone_number, gender, date_of_birth, password], (err, result) => {
      if (err) {
        console.error('Query error:', err);
        return res.status(500).json({ status: 0, message: err.message });
      }
      res.status(200).json({ status: 1, message: 'Thành công!' });
    })
  }

  async Login(req, res) {
    let email = req.body.email
    let password = req.body.password
    console.log(req.body)
    let result = []
    result = await pool.query(queries.login, [email, password])
    if (!result.rows.length) {
      res.status(500).json({ status: 0, message: "Your email or password is wrong !!" })
    }
    console.log(result.rows[0])
    const token = await jwt.sign(result.rows[0], process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })

    res.cookie('access_token', token, {
               // JavaScript không đọc được cookie này (an toàn với XSS)
      sameSite: 'Strict',    // Chặn gửi cookie trong cross-site requests
      maxAge: 3600000        // 1 giờ (miliseconds)
    });
    return res.json(result.rows[0]);
  }

  returnToken(req, res) {
    let user = req.user
    res.status(200).json(req.user)
    console.log(user)
  }

}


module.exports = new LoginController();
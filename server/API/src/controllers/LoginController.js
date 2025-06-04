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
    let role = req.body.role

    pool.query(queries.signin, [name, email, phone_number, gender, date_of_birth, role, password], (err, result) => {
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
      res.status(200).json({ status: 0, message: "Your email or password is wrong !!" })
    }
    return res.json(result.rows[0]);
  }

  returnToken(req, res) {
    let user = req.user
    res.status(200).json(req.user)
    console.log(user)
  }

  async checkEmail(req,res){
    let email = req.body.email  
    pool.query(queries.checkEmail,[email],(err,result)=>{
      if(err){
        console.error('Query error:', err);
        return res.status(500).json({ status: 0, message: err.message });
      }
      if(result.rows.length){
        return res.status(200).json({ status: 1, message: 'Email already exists' });
      }
      return res.status(200).json({ status: 0, message: 'Email does not exist' });
    })
  }



}


module.exports = new LoginController();
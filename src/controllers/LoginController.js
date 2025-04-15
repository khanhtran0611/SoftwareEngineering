const pool = require('../config/db/index.js')
const queries = require('../config/db/queries.js')
const jwt = require('jsonwebtoken');
require('dotenv').config()



class LoginController{
    AddNewCustomerAccount(req,res){
        let name = req.body.name
        let email = req.body.email
        let phone_number = req.body.phone_number
        let gender = req.body.gender
        let date_of_birth = req.body.date_of_birth
        let password = req.body.password
        pool.query(queries.signin,[name,email,phone_number,gender,date_of_birth,password],(err,result)=>{
            if (err) {
                console.error('Query error:', err);     
                return res.status(500).json({ error: 'Database error' });
              }
            res.status(200).json({ message: 'Thành công!' });
        })
    }

    async Login(req,res){
        let email = req.body.email
        let password = req.body.password
        let result = await pool.query(queries.login,[email,password])
        if(result.rows[0] === 'null'){
             res.status(500).json({message : "Your email or password is wrong !!"})
        }        
        const token = await jwt.sign(result.rows[0],process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '1h' })
        res.json({ token });
    }

    returnToken(req,res){
       let user = req.user
       res.status(200).json(req.user)
       console.log(user)
    }

}


module.exports = new LoginController();
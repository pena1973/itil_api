// Соглашение может быть только одно
const db = require('../db')
const bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const {secret} = require("../config")

const  generateAccessToken = (id,id_client)=>{
    const payload = {
        id, id_client
    }
return jwt.sign(payload,secret,{expiresIn:24})
}

class AuthController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({"message":"Ошибка при регистрации",errors})
            }
            const {name, login, pass} = req.body  
            const answer0 = await db.query('SELECT * FROM users WHERE login =$1', [login])
            
            if (answer0.rows.length >= 1) {
                console.log('В базе уже есть пользователь с таким логином')
               return res.status(400).json('В базе уже есть пользователь с таким логином')
            }

            var hashPass = bcrypt.hashSync(pass, 7);
            const answer1 = await db.query('INSERT INTO users (name, login, pass,id_client) values($1,$2,$3,$4) RETURNING * ', [name, login, hashPass,"new"])
            const newUser = answer1.rows[0]
            const id_client = "Mobs_"+("00000000000"+newUser.id).slice(-11);
            const updUser = await db.query('UPDATE users set id_client=$1 where id=$2 RETURNING * ',  [id_client,newUser.id])    
            
            res.json('Registration successful')       

        }
        catch (e) {
            console.log(e)
            res.status(400).json('Registration error')
        }
    }

    async login(req, res) {
        try {
            const {login, pass} = req.body  
            const answer0 = await db.query('SELECT * FROM users WHERE login =$1', [login]) 
            const userBD = answer0.rows[0]           
            if (answer0.rows.length = 0) {
                console.log('Пользователь &{login} не найден')
               return res.status(400).json('Пользователь &{login} не найден')
            }
            var validPass = bcrypt.compareSync(pass, userBD.pass);
            if (!validPass) {
                console.log('Неверный пароль')
               return res.status(400).json('Неверный пароль')
            }
        const token = generateAccessToken(userBD.id,userBD.id_client)
            return res.json({token})
        }
        catch (e) {
            console.log(e)
            res.status(400).json('Login error')
        }
    }

}
module.exports = new AuthController()


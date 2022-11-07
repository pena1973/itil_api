const db = require('../db')

class UserController{   
   // регистрация пользователя перенесен в модуль ауткентификайции
    // async createUser(req,res){
    // const {name, login, pass} = req.body  
    // const answer1 = await db.query('INSERT INTO users (name, login, pass,id_client) values($1,$2,$3,$4) RETURNING * ', [name, login, pass,"new"])
    // const newUser = answer1.rows[0]
    // const id_client = "Mobs_"+("00000000000"+newUser.id).slice(-11);
    // const updUser = await db.query('UPDATE users set id_client=$1 where id=$2 RETURNING * ',  [id_client,newUser.id])    
    // res.json(updUser.rows[0])
    // }
      
    //  Получили всех юзеров
    async getUsers(req,res){
        const users = await db.query('SELECT * FROM users')
        res.json(users.rows)
}
    //  Получили одного юзера
    // http://localhost:8080/api/user/Mobs_00000000009  - строка запроса
    async getOneUser(req,res){
        console.log(req.params.id_client)
        const id_client = req.params.id_client
        const user = await db.query('SELECT * FROM users WHERE id_client =$1', [id_client])
        res.json(user.rows[0])
    }
    // полный апдейт информации, если предварительно не зарегистрирован - тогда сообщение
    async updateUser(req, res) {
        const { name, regNumber, account, bank, iban, swift, login, pass, id_client } = req.body
        const answer = await db.query('SELECT * FROM users WHERE id_client =$1', [id_client])
        if (answer.rows.length == 0) {
            console.log('id_client в базе не обнаружен')
            res.send('id_client в базе не обнаружен')
        } else {
            const user = await db.query('UPDATE users set name=$1, regNumber=$2,account=$3,bank=$4,iban=$5,swift=$6,login=$7,pass=$8 where id_client=$9 RETURNING * ',
                [name, regNumber, account, bank, iban, swift, login, pass, id_client])
            res.json(user.rows[0])
        }
    }
    //  апдейт логина пароля, если предварительно не зарегистрирован - тогда сообщение
    async updateUsersLoginPass(req, res) {
        const { login, pass, id_client } = req.body
        const answer1 = await db.query('SELECT * FROM users WHERE id_client =$1', [id_client])
        if (answer1.rows.length == 0) {        
            res.send('id_client в базе не обнаружен')
        } else {
        const user = await db.query('UPDATE users set login=$1,pass=$2 where id_client=$3 RETURNING * ',
            [login, pass, id_client])
        res.json(user.rows[0])
        }
    }
    // апдейт банковских реквизитов, если предварительно не зарегистрирован - тогда сообщение
    async updateUsersBankAccount(req, res) {
        const {account, bank, iban, swift, id_client } = req.body
        const answer1 = await db.query('SELECT * FROM users WHERE id_client =$1', [id_client])
        if (answer1.rows.length == 0) {        
            res.send('id_client в базе не обнаружен')
        } else {
        const user = await db.query('UPDATE users set account=$1,bank=$2,iban=$3,swift=$4 where id_client=$5 RETURNING * ',
            [account, bank, iban, swift, id_client])
        res.json(user.rows[0])
       }
    }
    // апдейт названия и регномера, если предварительно не зарегистрирован - тогда сообщение
    async updateUsersNameRegNumber(req, res) {
        const { name, regNumber, id_client } = req.body
        const answer1 = await db.query('SELECT * FROM users WHERE id_client =$1', [id_client])
        if (answer1.rows.length == 0) {        
            res.send('id_client в базе не обнаружен')
        } else {        
        const user = await db.query('UPDATE users set name=$1, regNumber=$2 where id_client=$3 RETURNING * ',
            [name,regNumber, id_client])
        res.json(user.rows[0])
        }
    } 
    // удаление юзера по id_client
    async deleteUser(req,res){
        const id_client = req.params.id_client
        const user = await db.query('DELETE FROM users WHERE id_client =$1',[id_client])
        res.json(user.rows[0])           
    }   
}
module.exports = new UserController()



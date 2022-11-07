const Router = require('express')
const { check } = require('express-validator')
const router = new Router()
const userController = require('../controller/auth.controller')
//const authMidleWare = require('../authMidleWare') // Это проверка токена это в юзерсах уже

router.post('/registration', [
    check('login','Укажите логин').notEmpty(),
    check('name','Укажите имя').notEmpty(),
    check('pass','Длина пароля должна быть от 4 до 6 символов').isLength({min:4,max:6}) 
    ], userController.registration)
router.post('/login',  userController.login)

//router.get('/getUsers', authMidleWare,  userController.getUsers)

module.exports = router
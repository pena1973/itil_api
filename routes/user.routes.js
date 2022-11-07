const Router = require('express')
const router = new Router()
const userController = require('../controller/user.controller')
const authMidleWare = require('../authMidleWare')

//router.post('/user',userController.createUser)

router.get('/users',             authMidleWare,userController.getUsers)
router.get('/user/:id_client',   authMidleWare,userController.getOneUser)
router.put('/user',              authMidleWare,userController.updateUser)
router.put('/userBank',          authMidleWare,userController.updateUsersBankAccount)
router.put('/userLogin',         authMidleWare,userController.updateUsersLoginPass)
router.put('/userName',          authMidleWare,userController.updateUsersNameRegNumber)
router.delete('/user/:id_client',authMidleWare,userController.deleteUser)

module.exports = router
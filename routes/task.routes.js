const Router = require('express')
const router = new Router()
const taskController = require('../controller/task.controller')
const authMidleWare = require('../authMidleWare')

router.post('/task',                  authMidleWare,taskController.createTask)
router.get('/taskByClient/:id_client',authMidleWare,taskController.getTaskByClient) // id client
router.get('/task/:id_tiket/',        authMidleWare,taskController.getTask)         // id task
router.get('/queue/:id_client',       authMidleWare,taskController.getQueue)       // id client - скрываем то что не нужно
router.put('/task',                   authMidleWare,taskController.updateTask)      // id task

module.exports = router
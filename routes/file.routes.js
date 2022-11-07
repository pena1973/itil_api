const Router = require('express')
const router = new Router()
const fileController = require('../controller/file.controller')
const authMidleWare = require('../authMidleWare')

router.post('/file',                  authMidleWare,fileController.createFile)
router.get('/fileByTiket/:id_tiket/', authMidleWare,fileController.getFilesByTask) 
router.get('/file/:id_file/',         authMidleWare,fileController.getFile)
router.put('/file/',                  authMidleWare,fileController.updateFile)      
router.delete('/file/:id_file/',      authMidleWare,fileController.deleteFile) 
module.exports = router
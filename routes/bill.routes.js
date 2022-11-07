

const Router = require('express')
const router = new Router()
const billController = require('../controller/bill.controller')
const authMidleWare = require('../authMidleWare')


router.post('/bill',                    authMidleWare, billController.createBill)
router.get('/billsByClient/:id_client', authMidleWare, billController.getBillByClient)
router.get('/billsByPeriod/',           authMidleWare, billController.getBillbyPeriod) 

//router.get('/billsByPeriod/:dateStart/:dateFinish/', billController.getBillbyPeriod) 

router.get('/bill/:id_file/',           authMidleWare, billController.getBill)       
router.put('/bill',                     authMidleWare, billController.updateBill)    
router.delete('/bill/:id_file',         authMidleWare, billController.deleteBill)    

module.exports = router
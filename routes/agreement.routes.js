const Router = require('express')
const router = new Router()
const agreementController = require('../controller/agreement.controller')
const authMidleWare = require('../authMidleWare')

router.post('/agreement',                   authMidleWare,agreementController.createAgreement)
router.get('/agreementByClient/:id_client/',authMidleWare,agreementController.getAgreementByClient)
router.put('/agreement',                    authMidleWare,agreementController.updateAgreement)
router.delete('/agreement/:id_client/',     authMidleWare,agreementController.deleteAgreemrnt)

module.exports = router
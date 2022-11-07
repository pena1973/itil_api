const Router = require('express')
const router = new Router()
const instructionController = require('../controller/instruction.controller')
const authMidleWare = require('../authMidleWare')

router.post('/instruction',                    authMidleWare,instructionController.createInstruction)
router.get('/instructionsByClient/:id client/',authMidleWare,instructionController.getInstructionsByClient)
router.get('/instructionsByTiket/:id_tiket/',  authMidleWare,instructionController.getInstructionsByTiket) 
router.get('/instruction/:id_file/',           authMidleWare,instructionController.getinstruction)       
router.put('/instruction',                     authMidleWare,instructionController.updateInstruction)    
router.delete('/instruction/:id_file/',        authMidleWare,instructionController.deleteInstruction)    

module.exports = router
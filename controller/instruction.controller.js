const db = require('../db')
// react-native-fs - библиотека для скачивания файлов
class InstructionsController {
    async createInstruction(req, res) {
        const {file,name,type,size,id_file, id_tiket, id_client,id_task, id_user } = req.body
        const newInstruction = await db.query('INSERT INTO instructions (file,name,type,size,id_file,id_tiket,id_client,id_task, id_user) values($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING * ', 
        [file,name,type,size,id_file, id_tiket, id_client,id_task, id_user])
        res.json(newInstruction)
    }

    async getInstructionsByTiket(req, res) {
        const id_tiket = req.query.id_tiket
        const getInstructions = await db.query('SELECT * FROM instructions WHERE id_tiket =$1', [id_tiket])
        res.json(getInstructions.rows)
    }
    async getInstructionsByClient(req, res) {
        const id_tiket = req.query.id_client
        const getInstructions = await db.query('SELECT * FROM instructions WHERE id_tiket =$1', [id_client])
        res.json(getInstructions.rows)
    }
    async getinstruction(req, res) {
        const id_file = req.query.id_file
        const getInstruction = await db.query('SELECT * FROM instructions WHERE id_file =$1', [id_file])
        res.json(getInstruction.rows[0])
    }
    async updateInstruction(req, res) {
        const {file,name,type,size,id_file, id_tiket, id_client,id_task, id_user} = req.body
        const fileUpd2 = await db.query('UPDATE instructions set file=$1, name=$2, type=$3, size=$4, id_tiket=$5,id_client=$6, id_task=$7, id_user=$8 where id_file=$9 RETURNING * ',
        [file,name,type,size, id_tiket,id_client,id_task, id_user,id_file])
        res.json(fileUpd2.rows[0])
    }

    async deleteInstruction(req, res) {
        const id_file = req.query.id_file
        const fileDel = await db.query('SELECT * FROM instructions WHERE id_file =$1', [id_file])
        res.json(fileDel.rows[0])
    }
}

module.exports = new InstructionsController()
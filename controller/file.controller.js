const db = require('../db')
// react-native-fs - библиотека для скачивания файлов
class FilesController {
    async createFile(req, res) {
        const { file, name, type, size, id_file, id_tiket } = req.body
        const answerAgreement = await db.query('SELECT * FROM tasks WHERE id_tiket =$1', [id_tiket])
        if (answerAgreement.rows.length == 0) {
            console.log('id_tiket в базе не обнаружен')
            res.send('id_tiket в базе не обнаружен')
            return
        } else {
            const agreement = answerAgreement.rows[0]
            const id_task = agreement.id;
            console.log(id_task)
            const ansnwer = await db.query('INSERT INTO files (file,name,type,size,id_file,id_tiket,id_task) values($1,$2,$3,$4,$5,$6,$7) RETURNING * ',
                [file, name, type, size, ((id_file == '') ? 'new' : id_file), id_tiket, id_task])

            const newFile = ansnwer.rows[0];
            if (id_file != '') {
                res.json(newFile)
            } else { }
            const new_id_file = "Mobt_" + ("00000000000" + newFile.id).slice(-11);
            const updAnsnwer = await db.query('UPDATE files set id_file=$1 where id=$2 RETURNING * ', [new_id_file, newFile.id])
            res.json(updAnsnwer.rows[0])
        }

    }

    async getFilesByTask(req, res) {
        const id_tiket = req.params.id_tiket
        //const id_tiket = req.query.id_tiket
        const getFiles = await db.query('SELECT * FROM files WHERE id_tiket =$1', [id_tiket])
        res.json(getFiles.rows)
    }
    async getFile(req, res) {
        const id_file = req.params.id_file
        //const id_file = req.query.id_file
        console.log(id_file)
        const getFile = await db.query('SELECT * FROM files WHERE id_file =$1', [id_file])
        res.json(getFile.rows[0])
    }
    async updateFile(req, res) {
        const { file, name, type, size, id_file } = req.body
        console.log(id_file)
        const answer = await db.query('SELECT * FROM files WHERE id_file =$1', [id_file])

        if (answer.rows.length == 0) {
            console.log('id_file в базе не обнаружен')
            res.send('id_file в базе не обнаружен')
            return
        } else {
            const fileUpd = await db.query('UPDATE files set file=$1, name=$2, type=$3, size=$4 where id_file=$5 RETURNING * ',
                [file, name, type, size, id_file])
            res.json(fileUpd.rows[0])
        }
    }
    async deleteFile(req, res) {
        const id_file = req.params.id_file
        //const id_file = req.query.id_file
        console.log(id_file)
        const fileDel = await db.query('DELETE FROM files WHERE id_file =$1', [id_file])
        res.json(fileDel.rows[0])
    }
}

module.exports = new FilesController()
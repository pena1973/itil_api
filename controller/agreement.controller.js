// Соглашение может быть только одно
const db = require('../db')

class AgreementController {
    async createAgreement(req, res) {
        const { id_client, signed, regular_fee, cheking_days, high_priority, midle_priority, low_priority, manager } = req.body

        // соглашение с клиентом может быть только одно поэтому перед записью проверяем наличие  и если есть не заносим
        const answerAgreement = await db.query('SELECT * FROM agreements WHERE id_client =$1', [id_client])
        if (answerAgreement.rows.length > 0) {
            res.send('Agreement уже есть в базе и повторно занесен не будет,  воспользуйтесь командой обновления')
            return
        }

        // нужно получить внутркенниф id клиента для связи таблиц
        const answer = await db.query('SELECT * FROM users WHERE id_client =$1', [id_client])
        if (answer.rows.length == 0) {
            console.log('id_client в базе не обнаружен')
            res.send('id_client в базе не обнаружен')
            return
        } else {
            const user = answer.rows[0]
            const id_user = user.id;
            console.log(id_user)
            // Проверить может уже есть и второй не заводить
            const newAgreement = await db.query('INSERT INTO agreements (id_client, signed, regular_fee, cheking_days, high_priority, midle_priority, low_priority, manager,id_user) values($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING * ',
                [id_client, signed, regular_fee, cheking_days, high_priority, midle_priority, low_priority, manager, id_user])
            res.json(newAgreement.rows[0])
        }
    }
    async getAgreementByClient(req, res) {
        const id_client = req.params.id_client
        const getAgreement = await db.query('SELECT * FROM agreements WHERE id_client =$1', [id_client])
        res.json(getAgreement.rows[0])
    }
    async updateAgreement(req, res) {
        const { id_client, signed, regular_fee, cheking_days, high_priority, midle_priority, low_priority, manager } = req.body
        const answerAgreement = await db.query('SELECT * FROM agreements WHERE id_client =$1', [id_client])

        if (answerAgreement.rows.length = 0) {
            res.send('Agreement в базе отсутствует,  воспользуйтесь командой создания')
            return
        }
        const updAgreement = await db.query('UPDATE agreements set signed=$1, regular_fee=$2, cheking_days=$3, high_priority=$4, midle_priority=$5, low_priority=$6, manager=$7  where id_client=$8 RETURNING * ',
            [signed, regular_fee, cheking_days, high_priority, midle_priority, low_priority, manager, id_client])
        res.json(updAgreement.rows[0])
    }
    async deleteAgreemrnt(req, res) {
        const id_client = req.params.id_client
        const delAgreement = await db.query('DELETE FROM agreements WHERE id_client =$1', [id_client])
        res.json(delAgreement.rows)
    }

}
module.exports = new AgreementController()


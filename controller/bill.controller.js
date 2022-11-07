const fileService = require('../fileService.js')
const db = require('../db')

function stringToDataStamp(str) {
    let arr = str.replaceAll(' ', ':').replaceAll('.', ':').split(':')
    //   console.log(arr)
    let date = new Date(arr[2], arr[1], arr[0], arr[3], arr[4], arr[5], 0);
    let timeZoneOffset = date.getTimezoneOffset()
    //console.log(timeZoneOffset)
    console.log(new Date(date-(timeZoneOffset*60*1000)))
    return (new Date(date-(timeZoneOffset*60*1000)))
}

// react-native-fs - библиотека для скачивания файлов
class BillController {

    async createBill(req, res ) {
        const { file, name, type, period, id_client } = req.body
        //"07.06.2022 13:22:39"  Это формат даты на входе
        const periodTS = stringToDataStamp(period)
        //console.log(req.files)
        //console.log(periodTS)
        const answerAgreement = await db.query('SELECT * FROM agreements WHERE id_client =$1', [id_client])
        if (answerAgreement.rows.length == 0) {
            console.log('id_client в базе не обнаружен')
            res.send('id_client в базе не обнаружен')
            return
        } else {
            const agreement = answerAgreement.rows[0]
            const id_agreement = agreement.id;
            console.log(id_agreement)
            const answerBill = await db.query('INSERT INTO bills (file,name,type,period,id_client,id_agreement,id_file) values($1,$2,$3,$4,$5,$6,$7) RETURNING * ',
                [file, name, type, period, id_client, id_agreement, "new"])
            const newBill = answerBill.rows[0]
            const id_file = "Mobb_" + ("00000000000" + newBill.id).slice(-11);
            console.log(id_file)
            console.log('req.files.file',req.files.file)
            const fileName = fileService.saveFile(req.files.file,id_file,type)
            console.log(fileName)
            const updBill = await db.query('UPDATE bills set id_file=$1 where id=$2 RETURNING * ', [id_file, newBill.id])
            res.json(updBill.rows[0])
        }
    }
    async getBillByClient(req, res) {
        const id_client = req.params.id_client
       // const id = req.query.id // - это если я хочу получить параметры запросf и тогда они пишутчся  через параметры

        const getBills = await db.query('SELECT * FROM bills WHERE id_client =$1', [id_client])
        res.json(getBills.rows)
    }
    async getBill(req, res) {
        const id_file = req.params.id_file
        //const id_file = req.query.id_file
        const getbill = await db.query('SELECT * FROM bills WHERE id_file=$1', [id_file])
        res.json(getbill.rows[0])
    }
    async getBillbyPeriod(req, res) {
        const { dateStart, dateFinish } = req.query;
        const getBill = await db.query('SELECT * FROM bills WHERE  period BETWEEN $1 AND $2', [dateStart, dateFinish])
        res.json(getBill.rows)
    }
    async updateBill(req, res) {
         const {file, name, type, period, id_file} = req.body
         console.log(req.body)

        const billUpd = await db.query('UPDATE bills set file=$1, name=$2, type=$3, period=$4 where id_file=$5 RETURNING * ',
            [file, name, type, period, id_file])
        res.json(billUpd.rows[0])
    }
    async deleteBill(req, res) {
        const id_file = req.params.id_file
       // console.log(id_file)
       // const id_file = req.query.id_file
        const billDel = await db.query('DELETE FROM bills WHERE id_file =$1', [id_file])
 

        res.json(billDel.rows[0])
    }
}

module.exports = new BillController()

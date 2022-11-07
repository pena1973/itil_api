const db = require('../db')

function stringToDataStamp(str) {
    if (str.trim() == '') {
        return null
    }
    else {
        let arr = str.replaceAll(' ', ':').replaceAll('.', ':').split(':')
        //   console.log(arr)
        let date = new Date(arr[2], arr[1], arr[0], arr[3], arr[4], arr[5], 0);
        let timeZoneOffset = date.getTimezoneOffset()
        //console.log(timeZoneOffset)
        console.log(new Date(date - (timeZoneOffset * 60 * 1000)))
        return (new Date(date - (timeZoneOffset * 60 * 1000)))
    }
}

class TaskController {
    async createTask(req, res) {
        // id_tiket если не заполнен то новый если заполнен то импортирован из других частей системы
        const { title, id_client, content, status, priority, created, registred, progres, cheking, apruved, canceled, closed, estime, id_tiket } = req.body

        // нужно получить внутркенний id клиента для связи таблиц
        let t_created = stringToDataStamp(created)
        let t_registred = stringToDataStamp(registred)
        let t_progres = stringToDataStamp(progres)
        let t_cheking = stringToDataStamp(cheking)
        let t_apruved = stringToDataStamp(apruved)
        let t_canceled = stringToDataStamp(canceled)
        let t_closed = stringToDataStamp(closed)

        const answer = await db.query('SELECT * FROM users WHERE id_client =$1', [id_client])
        if (answer.rows.length == 0) {
            console.log('id_client в базе не обнаружен')
            res.send('id_client в базе не обнаружен')
            return
        } else if (id_tiket.trim() != '') { // если тикет не пустой
            //проверяем наличие тикета если есть отправляем в апдейт 
            const answerTask = await db.query('SELECT * FROM tasks WHERE id_tiket =$1', [id_tiket])
            if (answerTask.rows.length == 0) {
                console.log('id_tiket в базе обнаружен')
                res.send('id_tiket в базе обнаружен, воспользуйтесь командой Update')
                return
            }
        }
        const user = answer.rows[0]
        const id_user = user.id
        console.log(id_user)

        const answerTask = await db.query('INSERT INTO tasks (title,id_client,content,status,priority,created,registred,progres,cheking,apruved,canceled,closed,estime,id_tiket,id_user) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING * ',
            [title, id_client, content, status, priority, t_created, t_registred, t_progres, t_cheking, t_apruved, t_canceled, t_closed, estime, "new", id_user])
        const newTask = answerTask.rows[0]
        const newId_tiket = "Mobs_" + ("00000000000" + newTask.id).slice(-11)
        console.log(newId_tiket)
        const updTask = await db.query('UPDATE tasks set id_tiket=$1 where id=$2 RETURNING * ', [newId_tiket, newTask.id])
        res.json(updTask.rows[0])
    }


    async getTaskByClient(req, res) {
        const id_client = req.params.id_client
        console.log({ id_client })
        const getTask = await db.query('SELECT * FROM tasks WHERE id_client =$1', [id_client])
        res.json(getTask.rows)
    }

    async getTask(req, res) {
        const id_tiket = req.params.id_tiket
        const getTask = await db.query('SELECT * FROM tasks WHERE id_tiket =$1', [id_tiket])
        res.json(getTask.rows[0])
    }
    async updateTask(req, res) {
        const { title, content, status, priority, created, registred, progres, cheking, apruved, canceled, closed, estime, id_tiket } = req.body

        // нужно получить внутркенний id клиента для связи таблиц
        let t_created = stringToDataStamp(created)
        let t_registred = stringToDataStamp(registred)
        let t_progres = stringToDataStamp(progres)
        let t_cheking = stringToDataStamp(cheking)
        let t_apruved = stringToDataStamp(apruved)
        let t_canceled = stringToDataStamp(canceled)
        let t_closed = stringToDataStamp(closed)

        const updTask = await db.query('UPDATE tasks set title=$1, content=$2, status=$3, priority=$4, created=$5, registred=$6, progres=$7,cheking=$8,apruved=$9,canceled=$10,closed=$11,estime=$12  where id_tiket=$13 RETURNING * ',
            [title, content, status, priority, t_created, t_registred, t_progres, t_cheking, t_apruved, t_canceled, t_closed, estime, id_tiket])
        res.json(updTask.rows[0])
    }

    async getQueue(req, res) {
        const id_client = req.params.id_client
        console.log({ id_client })

        const request = 'SELECT '
            + ' CASE WHEN id_client =$1  THEN title ELSE $2 end  as title, '
            + ' priority,'
            + ' CASE WHEN id_client =$1  THEN content ELSE $5 end  as content,'
            + ' estime,'
            + ' coalesce(sum(estime) over (order by created'
            + '                rows between unbounded preceding and current row),'
            + '                0) as total,'
            + ' id_tiket'
            + ' FROM tasks'
            + ' WHERE (status = $3 OR status =$4)'
            + ' ORDER BY priority, registred'

        const post = await db.query(request, [id_client, 'Задача', 'registered', 'processing', ''])
        // total - это нарастающий итог
        res.json(post.rows)

    }
}

module.exports = new TaskController()


// processing
// closed
// registered
// not_accepted
// checking
// canceled
// completed
// draft

// title,id_client,status,priority,created,registred,progres,cheking,apruved,canceled,closed,estime,id_tiket,id_user,

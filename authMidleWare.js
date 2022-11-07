
const jwt = require('jsonwebtoken')
const { secret } = require('./config')

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(403).json({ message: "Пользователь не авторизован" })
        }
        const decodedData = jwt.verify(token, secret,) // здесь лежит обьект payload
        req.user = decodedData
        next() // Вызов следущего мидл вере

    } catch (e) {
        console.log(e)
        return res.status(403).json({ message: "Пользователь не авторизован" })
    }
}
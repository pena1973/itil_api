const fileUpload        = require('express-fileupload')
const express           = require('express')

const userRouter        = require('./routes/user.routes')
const agreementRouter   = require('./routes/agreement.routes')
const taskRouter        = require('./routes/task.routes')
const fileRouter        = require('./routes/file.routes')
const instructionRouter = require('./routes/instruction.routes')
const billRouter        = require('./routes/bill.routes')
const authRouter        = require('./routes/auth.routes')


const PORT = process.env.PORT || 8080

const app = express()

app.use(express.json())
app.use(fileUpload({}))
app.use('/api',userRouter)
app.use('/api',agreementRouter)
app.use('/api',taskRouter)
app.use('/api',fileRouter)
app.use('/api',instructionRouter)
app.use('/api',billRouter)
app.use('/api',authRouter)

app.listen(PORT,()=>console.log('Server started on port ' + PORT))
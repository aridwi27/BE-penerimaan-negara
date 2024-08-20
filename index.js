const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const http = require('http')
const userRoute = require('./src/routes/users')
const history = require('connect-history-api-fallback')
const app = express()




app.use(cors({
    origin: '*'
}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(userRoute)

// API History
app.use(history({
    verbose: true
}))


require('dotenv').config()
const PORT = 3001;




const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server running on PORT${PORT}`)
})
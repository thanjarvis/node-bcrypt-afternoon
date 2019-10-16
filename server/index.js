require('dotenv').config()
const express = require('express')
const session = require('express-session')
const massive = require('massive')
const{SESSION_SECRET, CONNECTION_STRING, SERVER_PORT} = process.env
const treasureCtrl = require('./controller/treasureController')
const auth = require('./middleware/authMidlleware')

const app = express()
app.use(express.json())

const authCtrl = require('./controller/authController')

massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
    console.log('DB connected');
})

app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET,
  })
);

app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.get('/auth/logout', authCtrl.logout)
app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure)
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)



const port = 4000
app.listen(port, () => console.log(`were watching you..... from port ${port}`))
if(process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const express = require('express')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const bodyparser =  require('body-parser')
const flash = require('express-flash')
const session = require('express-session')

const passportconfig = require('./process-config')

passportconfig(passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id))

const app = express()

app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(express.urlencoded({extended: false}))


const users = [ ]

app.use(passport.initialize())
app.use(passport.session())

app.set('view engine', 'ejs')

app.get('/', (request, response) => {
    response.render('index', {name: request.user.name})
})



app.post('/register',async (req, res) => {

    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        console.log(users)

        res.redirect('/login')

    }
    catch{
        res.redirect('/register')
    }
} )

app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash:true
}))


const PORT = process.env.PORT || 8080

app.listen(PORT, ( ) => {
    console.log(`listening to port ${PORT}`)
})
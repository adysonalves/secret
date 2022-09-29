require('dotenv').config()
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const hbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash')
app.use(express.static('public'));
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());

// HANDLEBARS
app.engine('hbs', hbs.engine({
    defaultLayout: 'main',
    extname: 'hbs'
})); app.set('view engine', 'hbs');

// SESSION
app.use(session({
    secret: 'DpLmg5cjCOLKXKE6Zy6VBPOlS0S7m9dK',
    resave: false,
    saveUninitialized: true
})); app.use(flash())

// DATABASE
const {Sequelize, sequelize} = require('./src/database/connection');

// MODELS
const User = require('./src/database/models/Users');
const Ask = require('./src/database/models/Ask');

// sequelize.sync()


// MIDDLEWARES

app.use('/profile', (req,res,next) => {
    if(!req.session.logado){
        req.flash('erro','Acesso negado. Faça login!')
        return res.redirect('/login');
    }
    next()
})

//ROTAS
const routerPrincipal = require('./routes/principal');
const userProfile = require('./routes/userProfile');
const routerProfile = require('./routes/profile');

app.use('/', routerPrincipal);
app.use('/', userProfile);
app.use('/profile', routerProfile);


// ERRO 404
app.use((req,res,next) => {
    res.status(404).send('Página não encontrada...')
});


app.listen(PORT, () => {
    console.log('Servidor rodando na porta: '+PORT);
})

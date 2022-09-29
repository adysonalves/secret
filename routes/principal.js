const express = require('express');
const User = require('../src/database/models/Users');
const router = express.Router();
const bcrypt = require('bcrypt');

router.get('/', (req,res) => {

    if(req.session.logado){
        return res.redirect('/profile')
    }

    res.status(200).render('home', {
        title: 'Crie sua conta',
        css: 'estilo',
        cssResponsive: 'responsividade',
        logado: req.session.logado,
        errorMsg: req.flash('erro'),
        successMsg: req.flash('success')
    });
});



router.post('/signup', async(req, res) => {

    let erros = [];

    let username = req.body.username;
    let email = req.body.email;
    let senha = req.body.senha;

    username = username.trim();
    email = email.trim();
    
    username = username.replace(/[0-9]/,'');

    username = username.toLowerCase()
    email = email.toLowerCase()

    if(!username || typeof username == undefined || username == ''){
        erros.push({mensagem: 'username não pode ser vazio!'});
    }

    if(username.length > 0 && username.length < 3){
        erros.push({mensagem: 'username muito curto.'});
    }

    if(!email || typeof email == undefined || email == '' || !(/\S+@\S+\.\S+/.test(email))){
        erros.push({mensagem: 'E-mail inválido!'})
    }

    if(!senha || typeof senha == undefined || senha == ''){
        erros.push({mensagem: 'Senha não pode ser vazia!'})
    }

    if(senha.length < 6){
        erros.push({mensagem: 'Senha muito curta!'});
    }

    let validaUsername = await User.findOne({
        where:{
            username: username
        }
    }).then(users => {
        return users;
    })

    if(validaUsername != null){
        erros.push({mensagem: 'Nome de usuário já está em uso.'});
    }

    let buscaCadastro = await User.findAll({
        where:{
            email: email
        }
    }).then(dados => {
        return dados
    });

    if(buscaCadastro.length > 0){
        erros.push({mensagem: 'E-mail já está em uso.'});
    }

    if(erros.length > 0){
       return res.status(200).render('home2', {
            title: 'Crie sua conta',
            css: 'estilo',
            cssResponsive: 'responsividade',
            logado: req.session.logado,
            errorMsg: req.flash('erro'),
            successMsg: req.flash('success'),
            erros: erros
        });
    }
    


    let encriptaSenha = await bcrypt.hash(senha, 10);

    await User.create({
        username: username,
        email: email,
        senha: encriptaSenha
    }).then(success => {
        req.flash('success','Conta criada com sucesso. Faça login!');
        return res.status(200).render('home2', {
            title: 'Crie sua conta',
            css: 'estilo',
            cssResponsive: 'responsividade',
            logado: req.session.logado,
            errorMsg: req.flash('erro'),
            successMsg: req.flash('success')
        });
    });

    
})

router.get('/login', (req,res) => {

    if(req.session.logado){
        return res.redirect('/profile')
    }

    res.status(200).render('login', {
        title: 'Acessar conta',
        css: 'estilo',
        cssResponsive: 'responsividade',
        logado: req.session.logado,
        errorMsg: req.flash('erro'),
        successMsg: req.flash('success')
    });
});

router.post('/signin', async(req,res) => {
    let erros = []
    email = req.body.email
    senha = req.body.senha

    email = email.trim();
    senha = senha.trim();

    email = email.toLowerCase();


    if(!email || typeof email == undefined || email == '' || !(/\S+@\S+\.\S+/.test(email))){
        erros.push({mensagem: 'E-mail inválido!'})
    }

    if(!senha || typeof senha == undefined || senha == ''){
        erros.push({mensagem: 'Senha não pode ser vazia!'})
    }

    if(erros.length > 0){
        return res.status(200).render('login', {
            title: 'Acessar conta',
            css: 'estilo',
            cssResponsive: 'responsividade',
            logado: req.session.logado,
            errorMsg: req.flash('erro'),
            successMsg: req.flash('success'),
            erros: erros
        });
    }


    let verificaLogin = await User.findOne({
        where:{
            email: email
        }
    }).then(dados => {
        return dados
    })

    if(verificaLogin != null && await bcrypt.compare(senha, verificaLogin.senha)){
        req.session.logado = true;
        req.session.userID = verificaLogin.id;
        return res.redirect('/profile')

    }

    req.flash('erro','Usuário ou senha inválidos!');
    res.redirect('/login');


    
})

router.get('/logout', (req,res) => {
    if(!req.session.logado){
        req.flash('erro','Acesso negado. Faça login!')
        return res.redirect('/login');
    }

    req.session.destroy();
    return res.redirect('/login')
})

module.exports = router;
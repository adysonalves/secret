const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt')
const Ask = require('../src/database/models/Ask');
const User = require('../src/database/models/Users');
const router = express.Router();

router.get('/', async(req,res) => {
    let dataUser = await User.findByPk(req.session.userID).then(dataUser => {
        return dataUser
    });
    
    let ask = await Ask.findAll({
        where:{
            [Op.and]:[
                {id_user: req.session.userID},
                {answer: ''}
            ]
        },
        order:[
            ['id','DESC']
        ]
    }).then(ask => {
        return ask.map(ask => ask.toJSON())
    })

    res.status(200).render('./pages/profile', {
        title: 'Profile',
        css: 'estilo2',
        cssResponsive: 'responsividade3',
        logado: req.session.logado,
        nameUser: dataUser.username,
        ask: ask,
        errorMsg: req.flash('erro'),
        successMsg: req.flash('success')
    });
});

router.get('/settings', async(req,res) => {
    let dataUser = await User.findByPk(req.session.userID).then(dataUser => {
        return dataUser
    });

    res.status(200).render('./pages/settings', {
        title: 'Settings',
        css: 'estilo2',
        cssResponsive: 'responsividade3',
        logado: req.session.logado,
        idUser: req.session.userID,
        nameUser: dataUser.username,
        email: dataUser.email,
        errorMsg: req.flash('erro'),
        successMsg: req.flash('success')
    });
});

router.post('/settings', async(req,res) => {
    let dataUser = await User.findByPk(req.session.userID).then(dataUser => {
        return dataUser
    });

    const erros = [];

    email = req.body.email
    senha = req.body.senha

    email = email.trim();
    senha = senha.trim();

    if(!email || typeof email == undefined || email == ''){
        erros.push({mensagem:'E-mail não pode ser vazio'})
    }

    if(!senha || typeof senha == undefined || senha == ''){
        erros.push({mensagem:'Senha não pode ser vazia'})
    }

    if(senha.length < 6){
        erros.push({mensagem:'Senha muito curta!'});
    }

    let encryptaSenha = await bcrypt.hash(senha,10)

    if(erros.length > 0){
        return res.status(200).render('./pages/settings', {
            title: 'Settings',
            css: 'estilo2',
            cssResponsive: 'responsividade3',
            logado: req.session.logado,
            nameUser: dataUser.username,
            email: dataUser.email,
            erros: erros,
            errorMsg: req.flash('erro'),
            successMsg: req.flash('success')
        });
    }

    let buscaEmail = await User.findOne({
        where:{
            email: req.body.email
        }
    }).then(dados => {
        return dados;
    });
    

    if(buscaEmail != null){
        req.flash('erro','E-mail já está em uso ou já é o seu e-mail atual.');
        console.log(req.body.email)
        return res.redirect('/profile/settings');
    }

    await User.update({
        email: email,
        senha: encryptaSenha
    },{
        where:{
            id: req.body.id
        }
    }).then(success => {
        req.flash('success', 'Suas informações foram alteradas com sucesso!');
        return res.redirect('/profile/settings');
    })


});

router.post('/answer', async(req,res) => {
    await Ask.update({
        answer: req.body.answer
    },
    {
        where:{
            id: req.body.id
        }
    }
    ).then(success => {
        req.flash('success', 'Você respondeu com sucesso!');
        return res.redirect('/profile');
    })
})

module.exports = router;
const express = require('express');
const Ask = require('../src/database/models/Ask');
const User = require('../src/database/models/Users');
const router = express.Router();

router.get('/@/:username', async(req, res) => {
    let username = req.params.username

    let userProfile = await User.findOne({
        where:{
            username: username
        }
    }).then(response => {
        return response
    });

    if(userProfile != null){
        let askUser = await Ask.findAll({
            limit: 10,
            where:{
                id_user: userProfile.id
            },
            order:[
                ['id','DESC']
            ]
        }).then(ask => {
            return ask.map(ask => ask.toJSON());
        })

        return res.status(200).render('userProfile', {
            title: `@${username}`,
            css: 'estilo3',
            cssResponsive: 'responsividade2',
            username: userProfile.username,
            ask: askUser,
            logado: req.session.logado,
            errorMsg: req.flash('erro'),
            successMsg: req.flash('success')
        });
    } else{
        res.send('Perfil não encontrado...')
    }

   
});


router.post('/@/:username/ask', async(req,res) => {
    let username = req.params.username

    let userProfileId = await User.findOne({
        where:{
            username: username
        }
    }).then(profile => {
        return profile.id
    })

    await Ask.create({
        ask: req.body.ask,
        id_user: userProfileId
    }).then(success => {
        req.flash('success', 'Sua pergunta foi enviada com sucesso!')
        return res.redirect(`/@/${username}`);
    }).catch(err => {
        console.log(err)
    })
})

module.exports = router;
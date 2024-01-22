import { Router } from 'express';
import crypto from 'crypto'
import { modeloUsuarios } from '../dao/models/usuarios.modelo.js';
export const router=Router()
import passport from 'passport';
import { generaJWT, validarJWT } from '../utils.js';

router.get('/github',passport.authenticate('github',{}),(req,res)=>{});

router.get('/githubcallback',passport.authenticate('github',{failureRedirect:'/api/sesions/errorGithub'}),(req,res)=>{
    res.setHeader('Content-Type','application/json');
    res.status(200).json({
        mensaje:'Login OK',
        usuario:req.user
    });
})

router.get('/errorGithub',(req,res)=>{
    res.setHeader('Content-Type','application/json');
    res.status(200).json({
        error:'Error en gitHub'
    });
})


router.post('/registro',async(req,res)=>{

    let {nombre,apellido, email,edad, password}=req.body

    if(!nombre || !email || !password || !apellido || !edad){
        return res.redirect('/registro?error=Complete email, nombre, apellido, edad, y contraseña')
    }

    let existe=await modeloUsuarios.findOne({email})
    if(existe){
        return res.redirect('/registro?error='+`Usuario ya está registrado: ${email}`)

    }

    password=crypto.createHmac('sha256','palabraSecreta').update(password).digest('base64')

    await modeloUsuarios.create({
        nombre, email, password, apellido, edad, cart:'',role:'usuario'
    })

    res.redirect(`/login?usuarioCreado=${email}`)
})

router.post('/login',async(req,res)=>{

    let {email, password}=req.body

    if(!email || !password) {
        //return res.redirect('/login?error=missing fields')
    }

    password=crypto.createHmac('sha256','palabraSecreta').update(password).digest('base64')

    let usuario=await modeloUsuarios.findOne({email, password})
    if(!usuario){
        //return res.redirect('/login?error=wrong credentials')

        res.setHeader('Content-Type','application/json');
        res.status(401).json({
            message:"Error at loading user"
        });
        return
    }


    req.session.usuario={
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        edad:usuario.edad,
        role:usuario.role
    }

    let token = generaJWT(usuario)

    
    res.setHeader('Content-Type','application/json');
    res.status(200).json({
        usuario,
        token
    });

    //res.redirect('/perfil')

    
});

router.get('/usuario',validarJWT,(req,res)=>{
    res.setHeader('Content-Type','application/json');
    res.status(200).json({
        mensaje:'usuario logueado'
    });

    //res.redirect('/perfil')

})



router.get('/logout',(req,res)=>{

    req.session.destroy(e=>console.log(e))

    res.redirect('/login?mensaje=success')

});
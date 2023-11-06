import { Router } from 'express';
import crypto from 'crypto'
import { modeloUsuarios } from '../dao/models/usuarios.models.js';
export const router=Router()

router.post('/registro',async(req,res)=>{

    let {nombre,apellido, email,edad, password}=req.body

    if(!nombre || !email || !password || !apellido || !edad){
        // return res.status(400).send('faltan datos')
        return res.redirect('/registro?error=Complete email, nombre, apellido, edad, y contraseña')
    }

    let existe=await modeloUsuarios.findOne({email})
    if(existe){
        // return res.status(400).send(`Usuario ya está registrado: ${email}`)
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
        return res.redirect('/login?error=missing fields')
    }

    password=crypto.createHmac('sha256','palabraSecreta').update(password).digest('base64')

    let usuario=await modeloUsuarios.findOne({email, password})
    if(!usuario){
        // return res.status(401).send('credenciales incorrectas')
        return res.redirect('/login?error=wrong credentials')
    }

    req.session.usuario={
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        edad:usuario.edad,
        role:usuario.role
    }

    res.redirect('/perfil')

    
});


router.get('/logout',(req,res)=>{

    req.session.destroy(e=>console.log(e))

    res.redirect('/login?mensaje=success')

});
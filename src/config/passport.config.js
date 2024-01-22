import passport from 'passport'
import github from 'passport-github2'
import { modeloUsuarios } from '../dao/models/usuarios.modelo.js'


export const inicializaPassport=()=>{


    passport.use('github',new github.Strategy(
        {
            clientID: 'Iv1.2e530426137b7935',
            clientSecret: '3cd92df320d3f33820b867a7b857bbe93dddacaa',
            callbackURL: 'http://localhost:3000/api/sessions/githubcallback'
        },
        async(token, tokenRefresh, profile, done)=>{
            try {
                let usuario = await modeloUsuarios.findOne({email:profile._json.email})
                if (!usuario){
                    usuario = await modeloUsuarios.create({
                        nombre: profile._json.name,
                        email:profile._json.email,
                        github:profile
                    })
                }
                done(null,usuario)
            } catch (error) {
                return done(error)
            }
        }
    ))

    //serialize y deseralize
    passport.serializeUser((usuario,done)=>{
        return done(null,usuario._id)
    })
    passport.deserializeUser(async(id, done)=>{
        let usuario=await modeloUsuarios.findById(id)
        return done(null,usuario)
    })

}

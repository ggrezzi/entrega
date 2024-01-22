import mongoose from 'mongoose'

export const modeloUsuarios=mongoose.model('usuarios', new mongoose.Schema({
    nombre: String,
    apellido:String,

    email: {
        type: String, unique: true
    },
    edad:Number,
    password: String,
    cart:String,
    role:{type:String, default:'usuario'},
    github:{}
}))
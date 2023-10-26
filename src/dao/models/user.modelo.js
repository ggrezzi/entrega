import mongoose from "mongoose";

export const modeloUsuarios=mongoose.model('usuarios', new mongoose.Schema({
    first_name:{
        type: String, require:true
    },
    last_name: {
        type: String, require: true
    },
    email: {
        type: String, require: true, unique:true
    },
    age: {
        type: Number, require: true
    },
    password: {
        type: Number, require: true, hash:true
    },
    cart: {
        type: String, require: false
    },
    role: {
        type: String, require: true, default:'user'
    }
}))
/*
const userCollection = 'users'
const userEsquema = new mongoose.Schema({
    first_name:{
        type: String, require:true
    },
    last_name: {
        type: String, require: true
    },
    email: {
        type: String, require: true, unique:true
    },
    age: {
        type: Number, require: true
    },
    password: {
        type: Number, require: true, hash:true
    },
    cart: {
        type: String, require: false
    },
    role: {
        type: String, require: true, default:'user'
    }
},{collection:'users'})


userEsquema.plugin(mongoosePaginate);
export const userModelo=mongoose.model(userCollection, userEsquema)*/
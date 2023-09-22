import mongoose from "mongoose";

const cartsCollection = 'carts'
const cartsEsquema = new mongoose.Schema({
    products:[{
        _id: {
            type:String, 
            require:true
        },
        quantity: {
            type:Number, 
            require:true}
    }]  
},{collection:'carts'})


export const cartsModelo=mongoose.model(cartsCollection, cartsEsquema)
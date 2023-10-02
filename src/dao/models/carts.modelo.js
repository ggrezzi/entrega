import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

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

cartsEsquema.plugin(mongoosePaginate);


export const cartsModelo=mongoose.model(cartsCollection, cartsEsquema)
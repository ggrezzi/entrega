import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productsCollection = 'products'
const productsEsquema = new mongoose.Schema({
    title:{
        type: String, require:true
    },
    description: {
        type: String, require: true
    },
    price: {
        type: Number, require: true
    },
    thumbnail: {
        type: String, require: false
    },
    code: {
        type: String, require: true, unique:true
    },
    stock: {
        type: Number, require: true
    }
},{collection:'products'})


productsEsquema.plugin(mongoosePaginate);
export const productsModelo=mongoose.model(productsCollection, productsEsquema)
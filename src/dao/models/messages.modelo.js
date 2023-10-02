import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const messagesCollection = 'messages'
const messagesEsquema = new mongoose.Schema({
        user: {
            type:String, 
            require:true
        },
        message: {
            type:String, 
            require:true}  
},{collection:'messages'})


messagesEsquema.plugin(mongoosePaginate);
export const messagesModelo=mongoose.model(messagesCollection, messagesEsquema)
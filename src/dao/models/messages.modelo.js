import mongoose from "mongoose";

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


export const messagesModelo=mongoose.model(messagesCollection, messagesEsquema)
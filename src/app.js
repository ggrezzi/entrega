import express from 'express';
import {engine} from 'express-handlebars'
import __dirname from './utils.js';
import {router as cartRouter } from './routes/cart.router.js';
import {router as productRouter} from './routes/products.router.js'
import {Server} from 'socket.io'
import path from 'path';
import { getCartById } from './routes/cart.router.js';
import mongoose from 'mongoose';

const PORT=8080;

const app=express();

app.engine('handlebars',engine())
app.set('views', path.join(__dirname,'/views'))
app.set('view engine', 'handlebars')

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'/public')));



app.use('/api/products',productRouter)
app.use('/api/carts',cartRouter)



const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});

mongoose.connect('mongodb+srv://gabrielgrezzi:coderhouse@cluster0.rbj8ofh.mongodb.net/?retryWrites=true&w=majority&dbName=ecommerce')
.then(console.log("Db connected ok"))
.catch(error=>console.log(error))





import express from 'express';
import {engine} from 'express-handlebars'
import __dirname from './utils.js';
import {Server} from 'socket.io'
import path from 'path';
import mongoose from 'mongoose';
import {messagesModelo} from './dao/models/messages.modelo.js'
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo'

import { router as vistasRouter } from './routes/vistas.router.js';
import { router as sessionsRouter } from './routes/sessions.router.js';
import {router as cartRouter } from './routes/cart.router.js';
import {router as productRouter} from './routes/products.router.js'


const PORT=8080;

const app=express();
app.use(cookieParser("entregaSecret"))

app.engine('handlebars',engine())
app.set('views', path.join(__dirname,'/views'))
app.set('view engine', 'handlebars')

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'/public')));



app.use('/api/products',productRouter)
app.use('/api/carts',cartRouter)
app.use('/', vistasRouter)
app.get('/chat',(req,res)=>{
    res.setHeader('Content-Type','text/html');
    res.status(200).render('chat');
})


app.use(session({
    secret:'thereIsNoSpoon',
    resave:true, saveUninitialized:true,
    store: MongoStore.create({
        mongoUrl:'mongodb+srv://gabrielgrezzi:coderhouse@cluster0.rbj8ofh.mongodb.net/?retryWrites=true&w=majority&dbName=ecommerce',
        ttl: 3600
    })
}))




app.get('/setCookie',(req,res)=>{
    res.cookie('entregaCookie','cookie de la entrega',{maxAge:10000,signed:true}.send("Cookie"))
})

app.get('/getCookies',(req,res)=>{
    res.send(req.signedCookies);
})

app.get('/deleteCookie',(req,res)=>{
    res.clearCookie('entregaCookie').send('Cookie Removed')
})


const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});

mongoose.connect('mongodb+srv://gabrielgrezzi:coderhouse@cluster0.rbj8ofh.mongodb.net/?retryWrites=true&w=majority&dbName=ecommerce')
.then(console.log("Db connected ok"))
.catch(error=>console.log(error))

let mensajes=[{
    emisor:'Server',
    mensaje:'Bienvenido al chat del curso Backend...!!!'
}]




let usuarios=[]
const io=new Server(server)

io.on('connection',socket=>{

    console.log(`Nueva conexion al socket: ${socket.id}`)

    socket.on('id', nombre=>{

        usuarios.push({
            id: socket.id,
            nombre
        })

        socket.emit('Hola', mensajes)
        socket.broadcast.emit('New User: ', nombre)

    })

    socket.on('nuevoMensaje',mensaje=>{
        mensajes.push(mensaje)
        messagesModelo.create({user:mensaje.emisor,message:mensaje.mensaje})
        io.emit('llegoMensaje', mensaje)

    })

    socket.on('disconnect',()=>{
        console.log(`se desconecto el cliente con id ${socket.id}`)
        let indice=usuarios.findIndex(usuario=>usuario.id===socket.id)
        let usuario=usuarios[indice]
        io.emit('usuarioDesconectado', usuario)
        console.log(usuario)
        usuarios.splice(indice,1)
    })

})


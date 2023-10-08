import express from 'express';
import {engine} from 'express-handlebars'
import __dirname from './utils.js';
import {router as cartRouter } from './routes/cart.router.js';
import {router as productRouter} from './routes/products.router.js'
import {Server} from 'socket.io'
import path from 'path';
import mongoose from 'mongoose';
import {messagesModelo} from './dao/models/messages.modelo.js'


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

app.get('/chat',(req,res)=>{
    res.setHeader('Content-Type','text/html');
    res.status(200).render('chat');
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


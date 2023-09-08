import express from 'express';
import {engine} from 'express-handlebars'
import __dirname from './utils.js';
import {router as cartRouter } from './routes/cart.router.js';
import {router as productRouter} from './routes/products.router.js'
import {Server} from 'socket.io'
import path from 'path';
import { getCartById } from './routes/cart.router.js';

const PORT=8080;

const app=express();

app.engine('handlebars',engine())
app.set('views', path.join(__dirname,'/views'))
app.set('view engine', 'handlebars')

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'/public')));



app.use('/products',productRouter)

app.get('/realtimeproducts',(rep,res)=>{
    res.setHeader('Content-Type','text/html');
    res.status(200).render('realtimeproducts');
})
//app.use('/realtimeproducts',cartRouter)

const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});

const io=new Server(server)

io.on('connection',socket=>{
    console.log(socket.id)
    socket.on('id',cartId=>{
        console.log(cartId)
        let cart = getCartById(cartId)
        socket.emit('recargaCarrito',cart)
    })
});



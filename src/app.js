import __dirname from './utils.js';
import path from 'path';
import express from 'express';
import {engine} from 'express-handlebars';
import mongoose from 'mongoose';
import session from 'express-session'
import ConnectMongo from 'connect-mongo'
import { config } from './config/config.js';
import { router as vistasRouter } from './routes/vistas.router.js';
import { router as sessionsRouter } from './routes/sessions.router.js';
import {router as productRouter} from './routes/products.router.js'
import passport from 'passport'
import {inicializaPassport} from './config/passport.config.js'

const PORT=3000;

const app=express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'/views'));
app.use('/products',productRouter)

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'/public')));

app.use(session({
    secret:'claveSecreta',
    resave:true, saveUninitialized:true,
    store: ConnectMongo.create({
        mongoUrl:config.MONGO_URL,
        ttl: config.PORT
    }),
    cookie:{maxAge:1000}
}))

inicializaPassport()
app.use(passport.initialize())
app.use(passport.session())
app.use('/', vistasRouter)
app.use('/api/sessions', sessionsRouter)

const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});

const conectar=async()=>{
    try {
        await mongoose.connect('mongodb+srv://gabrielgrezzi:coderhouse@cluster0.rbj8ofh.mongodb.net/?retryWrites=true&w=majority',{dbName:'ecommerce'})
        console.log(`Conexión a DB establecida`)
    } catch (err) {
        console.log(`Error al conectarse con el servidor de BD: ${err}`)
    }
}

conectar();
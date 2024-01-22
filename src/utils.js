import {fileURLToPath} from 'url';
import { dirname } from 'path';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

const PRIVATE_KEY='IamBatman'
export const generaJWT=(usuario)=>jwt.sign({usuario},PRIVATE_KEY,{expiresIn:'1h'})

export const validarJWT=(req,res,next)=>{
    //example header
    //Bearer token authorization
    let authToken=req.headers.authorization
    if (!authToken) return res.status(401),json({error:"non existing token"})
    let token = authToken.split(' ')[1] 

    jwt.verify(token,PRIVATE_KEY,(error,credentials)=>{
        if(error) return res.status(401),json({error:"invalid token"});
        req.user=credentials.usuario
        next()
    })
}


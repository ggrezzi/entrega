import { Router } from "express";
export const router=Router()
import fs from "fs"
import { productsModelo } from "../dao/models/products.modelo.js";
import { parseArgs } from "util";
import { stringify } from "querystring";
import mongoose from "mongoose";



router.get('/',async (req,res)=>{
    
    let products =await  productsModelo.find().lean()
    res.setHeader('Content-Type','text/html');
    res.status(200).render('products',{products});
    /*
    let filtros=Object.entries(req.query)
    let products=getProducts()
    if (filtros.length>0){
        if (filtros[0][0]=="limit") {
            let limit=parseInt(filtros[0][1])
            if (limit>products.length){res.json(products)}
            else{
                let resultados=[]
                for (let index = 0; index < limit; index++) {
                    resultados.push(products[index])
                }
                res.setHeader('Content-Type','text/html');
                
                res.status(200).render('products',{resultados});
            }
        }
        else{res.json("Invalid Parameter")} 
    }
    else{
        console.log(products)
        res.setHeader('Content-Type','text/html');
        res.status(200).render('products',{products});
    }*/

})


router.get('/:pid',async (req,res)=>{

    let id=req.params.pid
    let producto =await  productsModelo.findById(id)
    res.status(200).json({data:producto})

});

router.post('/', async (req,res)=>{
    //debo agregar un nuevo producto a la lista de productos.
    let nuevoProducto = req.body
    let resultado = await productsModelo.create(nuevoProducto)
    return res.status(400).json({resultado})

});

router.put('/:pid', async (req,res)=>{
    //modifico el producto cuyo id es pid
    let id=(req.params.pid)
    let update=req.body 
    let resultado = await productsModelo.updateOne({_id:id},update)
    if (resultado.acknowledged==true){return res.status(200).json({resultado})}
    else{
       return res.status(400).json({resultado})
    }

});

router.delete('/:pid', async(req,res)=>{
    //borro el producto cuyo id es pid
    let id=req.params.pid

    let resultado = await productsModelo.deleteOne({_id:id})
    if (resultado.acknowledged==true){return res.status(200).json({resultado})}
    else{
       return res.status(400).json({resultado})
    }
});



import { Router } from "express";
export const router=Router()
import fs from "fs"
import { productsModelo } from "../dao/models/products.modelo.js";
import { parseArgs } from "util";
import { stringify } from "querystring";
import mongoose from "mongoose";



router.get('/',async (req,res)=>{
    
    let   limite = parseInt(req.query.limit);
    let    pagina = req.query.page;
    let    sort = req.query.sort;
    let    type =  req.query.query;
    if(!pagina) pagina=1
    let products=[]

    if (limite){
        products =await  productsModelo.paginate({},{limit:limite,lean:true, page:pagina})
        res.setHeader('Content-Type','text/html');
        let { totalPages,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage } = products
        res.status(200).render('products',{
            products:products.docs,
            totalPages,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            limite
        });
    } 
    else {products =await  productsModelo.find().lean()
    console.log(products)
    
    res.setHeader('Content-Type','text/html');
    res.status(200).render('products',{products});}
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



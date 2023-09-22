import { Socket } from "dgram";
import { Router } from "express";
export const router=Router()
import fs from "fs"
import {Server} from 'socket.io'
import { productsModelo } from "../dao/models/products.modelo.js";
import { cartsModelo } from "../dao/models/carts.modelo.js";
let ruta='./src/data/carts.json' 




let rutaProductos='./src/data/products.json' 


function getCarts(){
    if(fs.existsSync(ruta)){
        return JSON.parse(fs.readFileSync(ruta,'utf-8'))
    }else{return []}
}

export function getCartById(cid){
    //metodo que retorna el carrito seleccionado  usando su ID
    let isPresent=false;
    let location=-1;
    let i=-1;
    let carts = getCarts()
    console.log(carts)
    if (carts.length==undefined){
        if (carts.id==cid){return carts}
        return ("Not Found")
    }
    carts.forEach(element => { 
        i++;
        if (element.id == cid) 
        {
            isPresent=true;
            location=i;
        }
    });
    if (isPresent) {return carts[location]}
    return ("Not Found")
}

function getProductById(id){

    //metodo que retorna el producto seleccionado  usando su ID
    let isPresent=false;
    let location=-1;
    let i=-1;
       
    let products = JSON.parse(fs.readFileSync(rutaProductos,'utf-8'))
    products.forEach(element => { 
        i++;
        if (element.id == id) 
        {
            isPresent=true;
            location=i;
        }
        
    });
    if (isPresent) {return products[location]}
    return ("Not Found")
}

function addProdToCart(cid,pid){
    let cart=getCartById(cid)    
    let prod=getProductById(pid)
    let isPresent=false;
    let location=-1;
    let i=-1;
    if (prod=="Not Found"){return "10"}
    if (cart=="Not Found"){return "01"}
    cart.products.forEach(element => { 
        i++;
        if (element.id == pid) 
        {
            isPresent=true;
            location=i;
        }  
    });
    if (isPresent){
            cart.products[location].quantity=cart.products[location].quantity+1}
    else{
        let newProd={
            quantity:1,
            id:pid
        }
        cart.products.push(newProd);
    }
    fs.writeFileSync(ruta, JSON.stringify(cart), function (err) {if (err) throw err;});
    return (0)
}


router.post('/:pid',async (req,res)=>{
    
    //debe crear un carrito nuevo

    let pid=req.params.pid
    let newCart={
        products:[],
    }
    let id=req.params.pid
    let producto =await productsModelo.findById(pid)
    let tempProd = {id:pid,quantity:1}
    newCart.products.push(tempProd)
    let resultado = await cartsModelo.create(newCart)
    return res.status(400).json({resultado})

});

router.get('/:cid',async (req,res)=>{
    let id=req.params.cid
    let cart =await  cartsModelo.findById(id)
    res.status(200).json({data:cart})
});


router.post('/:cid/product/:pid',async(req,res)=>{
    let cId=req.params.cid
    let pId=req.params.pid

    let carrito = await cartsModelo.findOne({'_id':cId})
    let alreadyPresent = carrito.products.find(product=> product._id === pId)
    if (alreadyPresent){
        alreadyPresent.quantity ++
        let response = await cartsModelo.updateOne({_id:cId, 'products._id':pId},{$set:{'products.quantity':alreadyPresent.quantity}})
    }   
    else{
        carrito.products.push({quantity:1,_id:pId})
    }

    await carrito.save();
    carrito = await cartsModelo.findOne({_id:cId});
    return res.status(400).json({carrito})
});





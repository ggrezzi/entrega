import { Socket } from "dgram";
import { Router } from "express";
export const router=Router()
import {Server} from 'socket.io'
import { productsModelo } from "../dao/models/products.modelo.js";
import { cartsModelo } from "../dao/models/carts.modelo.js";


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
        let response = await cartsModelo.updateOne({_id:cId, 'products._id':pId},
        {$set:{'products.$.quantity':alreadyPresent.quantity}})
    }   
    else{
        carrito.products.push({quantity:1,_id:pId})
    }
    await carrito.save();
    carrito = await cartsModelo.findOne({_id:cId});
    return res.status(200).json({carrito})
});



router.delete('/:cid/product/:pid',async (req,res)=>{
    let cId=req.params.cid
    let pId=req.params.pid
    let cart =await  cartsModelo.updateMany({_id:cId},{$pull:{products:{_id:pId}}})
    cart = await cartsModelo.findOne({_id:cId});
    res.status(200).json({data:cart})
});
router.delete('/:cid',async (req,res)=>{
    let cId=req.params.cid
    let cart =await  cartsModelo.updateMany({_id:cId},{$pull:{products:{}}})
    res.status(200).json({data:cart})
});

router.put('/:cid/products/:pid',async (req,res)=>{
    let quantity = req.body
    let cId=req.params.cid
    let pId=req.params.pid
    let carrito = await cartsModelo.updateOne({_id:cId, 'products._id':pId},
    {$set:{'products.$.quantity':quantity}})
    await carrito.save();
    carrito = await cartsModelo.findOne({_id:cId});
    return res.status(200).json({carrito})
});

router.delete('/:cid',async (req,res)=>{
    let cId=req.params.cid
    let carrito = await cartsModelo.updateOne({_id:cId},
    {$set:{'products':[]}})
    await carrito.save();
    carrito = await cartsModelo.findOne({_id:cId});
    return res.status(200).json({carrito})
});



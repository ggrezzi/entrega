

const socket = io()
let id = prompt("ingrese nro de carrito")
socket.emit('id',id)

let divCarrito = document.getElementById('carrito')

socket.on('recargaCarrito',carrito=>{

    let txt = `<h5 class="card-title">Cart ID: ${carrito.id}</h5>`
    carrito.products.forEach(element => {
        txt += `<p class="card-text">prod id: ${element.id}</p><p class="card-text">Cantidad:${element.quantity}</p>`        
    });
    divCarrito.innerHTML= txt;

})

socket.on('nuevoProd',producto=>{
    Swal.fire({
        text:`Nuevo producto agregado ${producto.description}`,
        toast:true,
        position:"top-right"
      })
})
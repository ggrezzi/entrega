import os from 'os'
import fs from 'fs'
export const validarProducto=(prod)=>{

    let {title, description,price, code, ...otros}=prod

    return `Error al cargar el producto.
Argumentos esperados:
    - name: de tipo String - se recibió ${name}
Argumentos opcionales: 
    - team, publisher, powers, alias - se recibieron ${JSON.stringify(otros)}
    
Fecha: ${new Date().toUTCString()}
Usuario: ${os.userInfo().username}
Terminal: ${os.hostname()}

`
}
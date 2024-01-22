import os from 'os'
import fs from 'fs'
export const validarProducto=(prod)=>{

    let {title, description,price, code, ...otros}=prod

    return `Error al cargar el producto.
Argumentos esperados:
- Title: de tipo String - se recibió ${title}
- Description: de tipo String - se recibió ${description}
- price: de tipo Int - se recibió ${price}
- code: de tipo String - se recibió ${code}

Argumentos opcionales: 
    - thumbnail,  - se recibieron ${JSON.stringify(otros)}
    
Fecha: ${new Date().toUTCString()}
Usuario: ${os.userInfo().username}
Terminal: ${os.hostname()}

`
}
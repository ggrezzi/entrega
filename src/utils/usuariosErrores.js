import os from 'os'
import fs from 'fs'
export const validaUsuario=(usuario)=>{

    let {nombre,apellido, email, edad, ...otros}=usuario

    return `Error al dar de alta el Usuario.
Argumentos esperados:
    - Nombre: de tipo String - se recibió ${nombre}
    - Apellido: de tipo String - Se recibio ${apellido}
    - Email: de tipo String - Se recibio ${email}
    - Edad: de tipo Int - Se recibio ${edad}
Argumentos opcionales: 
    - team, publisher, powers, alias - se recibieron ${JSON.stringify(otros)}
    
Fecha: ${new Date().toUTCString()}
Usuario: ${os.userInfo().username}
Terminal: ${os.hostname()}

`
}
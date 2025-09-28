const LibraryView = {                   //La vista recibe los datos crudos del modelo por medio del controlador y los convierte en un formato que se le pueda enviar al cliente.
    formatResponse : (data) => {        //Por medio del parametro data es que recibe la información del comando que haya elegido el cliente.
        if(!data){                      //Manejamos los errores por si es un comando no reconocido o null.
        return JSON.stringify({
            status: "error",
            message: "❌ No se pudo realizar la operación."
        });
    }

    if(typeof data === 'string'){        //Por si es un mensaje de texto, lo muestra así
        return JSON.stringify({
            status: "success",
            data
        });
    }
    
    if(Array.isArray(data)){            //Si es un array, lo muestra como un array de objetos
        return JSON.stringify({
            status: "success",
            data
        });
    }

    return JSON.stringify({             //Si es un único libro, lo envía como objeto.
        status: "success",
        data
    });
    
    },
}

export default LibraryView;














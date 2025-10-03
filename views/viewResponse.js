const LibraryView = {                   //La vista recibe los datos crudos del modelo por medio del controlador y los convierte en un formato que se le pueda enviar al cliente.
    formatResponse : (data) => {        //Por medio del parametro data es que recibe la información del comando que haya elegido el cliente.
        if(!data || data.length === 0){                      //Manejamos los errores por si es un comando no reconocido o null.
        return "❌ No se pudo realizar la operación"
    };

    if(typeof data === 'string'){        //Por si es un mensaje de formato string
        return data
    };

    if(typeof data === 'object' && !Array.isArray(data)){
        if(data.title){
            return `📖 ${data.title}\n ${data.authorId}\n ${data.publisherId}\n ${data.year}`;
        }
            if(data.name){
                return `📌 ${data.name}`;
                }
    };
    
    if(Array.isArray(data)){            //Si es un array, lo muestra como un array de objetos
        let message = '';
        if(data[0]?.title){
            data.forEach((b,i) => {
                message += `${i+1}. ${b.title} | ${b.authorId} | ${b.publisherId} | ${b.year}\n`
            });
        } else if(data[0]?.name){
            data.forEach((a,i) => {
                message += `${i+1}. ${a.name} - ${a.nationality || a.publisherId || ''}\n`
            });
        }
        return message;
    }

    return JSON.stringify(data)          //Por si es un solo objeto.
    
    }
}

export default LibraryView;
//Cuenta con un solo objeto con métodos que centraliza la presentación de los datos para el cliente

const LibraryView = {                   //La vista recibe los datos crudos del modelo por medio del controlador y los convierte en un formato que se le pueda enviar al cliente.
    
    formatResponse : (data) => {        //Por medio del parametro 'data' es que recibe la información que envía el controlador según el comando elegido por el cliente.
        
        if(!data || data.length === 0){                      //Manejamos los errores por si es un comando no reconocido o null.
            return '❌ No se pudo realizar la operación'
    };

    if(typeof data === 'string'){        //Si el dato ya es un string, simplemente lo retornamos tal cual
        return data
    };

    if(typeof data === 'object' && !Array.isArray(data)){       //Por si es un objeto (pero no un array)
        
        if(data.title){             //Si es un libro, mostramos sus campos
            return `📖 ${data.title}\n ${data.authorId}\n ${data.publisherId}\n ${data.year}`;
        }
            if(data.name){         // Si es un autor o editorial individual
                return `📌 ${data.name}`;
                }
    };
    
    if(Array.isArray(data)){            //Si es un array, lo mostramos ítem pot ítem
        let message = '';
        if(data[0]?.title){         //Array de libros
            data.forEach((b,i) => {
                message += `${i+1}. ${b.title} | ${b.authorId} | ${b.publisherId} | ${b.year}\n`
            });
        } else if(data[0]?.name){        //Array de autores o editoriales
            data.forEach((a,i) => {
                message += `${i+1}. ${a.name} - ${a.nationality || a.publisherId || ''}\n`
            });
        }
        return message;
    }

    return JSON.stringify(data)         // Si no es ninguno de los casos anteriores, devolvemos el objeto como JSON

    }
}

export default LibraryView;
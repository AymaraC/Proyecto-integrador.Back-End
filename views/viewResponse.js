const LibraryView = {                   //La vista recibe los datos crudos del modelo por medio del controlador y los convierte en un formato que se le pueda enviar al cliente.
    formatResponse : (data) => {        //Por medio del parametro data es que recibe la información del comando que haya elegido el cliente.
        if(!data){                      //Manejamos los errores por si es un comando no reconocido o null.
            return JSON.stringify({
                status: "error",
                message: "❌ No se pudo realizar la operación."
            }, null, 2)
        }
            return JSON.stringify({
            status: "success",
            data

        }, null, 2);
    }
    
};

export default LibraryView;

















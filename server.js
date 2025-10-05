import net from 'net';
import {v4 as uuidv4} from 'uuid';
import BookController from "./controllers/booksController.js";
import PublisherController from './controllers/publishersController.js';
import AuthorController from './controllers/authorsController.js';

const PORT = 8080;

function isJSON(str){                                   //Esta función valida que la cadena empiece y termine con {} para saber si es JSON. 
    return str.startsWith('{') && str.endsWith('}')     //Evita que que el programa se rompa antes de intentar el JSON.parse
};

const server = net.createServer();                          //Creamos el servidor TCP para la interfaz servidor -> cliente
server.on('connection', (socket) => {                       //Le asignamos un id único a cada cliente que se conecte.
    const clientId = uuidv4();
    console.log(`📡 Nuevo cliente conectado: ${clientId}`);    
    socket.write('¡Bienvenido a nuestra biblioteca! 📚\n')

    socket.on('data', (data) => {
        const command = data.toString().trim().toLowerCase().normalize('NFC')    //Utilizamos el .toString() para convertir el buffer a string, el normalize('NFC') para evitar errores por tildes, utilizamos el .trim()
                                                                                //para eliminar espacios innecesarios y el .toLowerCase() para evitar errores dependiendo de como escriba el cliente.
        console.log(`Cliente ${clientId}, envió: '${command}'`);
        if(command === 'get books'){                                            //Si el cliente envía 'get books' le pedimos al controlador que devuelva todos los libros.
        const response = BookController.getBooks();
        socket.write(response + '\n', 'utf-8');                                 //Utilizamos el 'utf-8' para que pueda soportar las tildes y los caracteres extraños como la 'ñ'
            
        } else if (command.startsWith('add book ')){                            //Si el comando comienza con 'add book', lo eliminamos para quedarnos solo con los datos del libro
            const bookDataString = command.replace('add book ', '').trim()

            if(isJSON(bookDataString)){                                     //Verificamos si el comando es formato JSON cuando hay 2 o más campos.
                const bookData = JSON.parse(bookDataString);                //Si lo es, convertimos los datos a un objeto JSON 
                
                if(!bookData.title || !bookData.author || !bookData.publisher){     //Validamos que no esten vacíos los campos de título, autor y editorial.
                    socket.write('❌ ERROR: El título, autor y editorial son obligatorios.\n', 'utf-8')
                
                } else if(!bookData.year || isNaN(Number(bookData.year))){            //Validamos que el número ingresado sea válido.
                    socket.write('ERROR: El año debe ser un número válido.\n', 'utf-8');
                
                } else {                                                            //Si pasa las validaciones agregamos el libro a nuestra biblioteca.
                    const response = BookController.addBook(
                        bookData.title,
                        bookData.author,
                        bookData.publisher,
                        bookData.year,
                        bookData.nationality
                    );
                    socket.write(response + '\n', 'utf-8');

                } 
                
            } else {

                socket.write('❌ ERROR: formato de JSON no válido.\n', 'utf-8')
            }

        } else if(command.startsWith('find book ')){
            const title = command.replace('find book ', '').trim();
            socket.write(BookController.findBook(title) + '\n', 'utf-8');

        } else if(command.startsWith('delete book ')){
            const title = command.replace('delete book ', '').trim();
            socket.write(BookController.deleteBook(title) + '\n', 'utf-8');
        }

            //----------------HASTA ACÁ LOS COMANDOS PARA "LIBROS".----------------//

        else if(command === 'get publishers'){      //Maneja comandos para obtener todas las editoriales, agregar una nueva o buscar una existente.
            const response = PublisherController.getPublishers();
            socket.write(response + '\n', 'utf-8');

        } else if(command.startsWith('add publisher ')){
            const publisher = command.replace('add publisher ', '').trim();

            if(!publisher){
                socket.write('❌ ERROR: El nombre de la editorial es obligatorio.\n', 'utf-8');
            } else {
                const response = PublisherController.addPublisher(publisher);
                socket.write(response + '\n', 'utf-8');
            }
        } else if(command.startsWith('find publisher ')){
            const publisher = command.replace('find publisher ', '').trim();
            const response = PublisherController.findPublisher(publisher);
            socket.write(response + '\n', 'utf-8');

        }

            //----------------HASTA ACÁ LOS COMANDOS PARA "EDITORIALES".----------------//

          else if(command === 'get authors'){               //Comandos para obtener autores, agregar o buscar. Para agregar o buscar, valida formato JSON y campos obligatorios.
            const authors = AuthorController.getAuthors();
            socket.write(authors + '\n', 'utf-8');

        } else if(command.startsWith('add author ')){
            const response = command.replace('add author ', '').trim();

            if(isJSON(response)){                                     
                const authorData = JSON.parse(response);       

                if(!authorData.name || !authorData.nationality){
                    socket.write('❌ ERROR: El nombre y la nacionalidad del autor son obligatorios.\n', 'utf-8')
                } else {
                    const response = AuthorController.addAuthor(authorData.name, authorData.nationality);
                    socket.write(response + '\n', 'utf-8');
                }

            } else {
                socket.write('❌ ERROR: formato de JSON no válido.\n')
            }

        } else if(command.startsWith('find author ')) {
                const jsonString = command.slice('find author '.length).trim();
                const {name, nationality} = JSON.parse(jsonString)
                
                const response = AuthorController.findAuthor(name, nationality); 
                socket.write(response + '\n', 'utf-8');
        } 

            //----------------HASTA ACÁ LOS COMANDOS PARA "AUTORES".----------------//
    
    });
    
    socket.on('error', (err) => {
        socket.write(`❌ Ocurrió un error: ${err.message}\n`, 'utf-8');
        console.error(err.message);
    });

    socket.on('end', () => {            //Evento que se dispara cuando el cliente cierra la conexión
        socket.write('👋 ¡Hasta luego!\n', 'utf-8')
        console.log(`🔌 El cliente: ${clientId} se desconectó.`);
        
    });

    socket.on('close', () => {          //Evento que se dispara cuando termina la sesión TCP, sin importar si hubo error o cierre normal.
        console.log(`Sesion con el cliente ${clientId} finalizada.`);
        
    });

});

server.listen(PORT, () => {             //Ponemos al servidor a escuchar conexiones entrantes en el puerto 8080.
    console.log(`Servidor escuchando en el puerto... ${PORT}`);
});





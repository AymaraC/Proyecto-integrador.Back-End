import net from 'net';
import {v4 as uuidv4} from 'uuid';
import BookController from "./controllers/booksController";
import PublisherController from './controllers/publishersController';
import AuthorController from './controllers/authorsController';

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
        const command = data.toString().trim().toLowerCase()    //Utilizamos el .toString() para convertir el buffer a string, utilizamos el .trim()
                                                                //para eliminar espacios innecesarios y el .toLowerCase() para evitar errores dependiendo de como escriba el cliente.

        if(command === 'get books'){                            //Si el cliente envía 'get books' le pedimos al controlador que devuelva todos los libros.
        const response = BookController.getBooks();
        socket.write(response + '\n');
            
        } else if (command.startsWith('add book')){             //Si el comando comienza con 'add book', lo eliminamos para quedarnos solo con los datos del libro
            const bookDataString = command.replace('add book', '').trim()

            if(isJSON(bookDataString)){                                     //Verificamos si el comando es formato JSON cuando hay 2 o más campos.
                const bookData = JSON.parse(bookDataString);                //Si lo es, convertimos los datos a un objeto JSON 
                socket.write(BookController.addBook(bookData.title, bookData.author, bookData.publisher, bookData.year) + '\n');
            
            } else {
                socket.write('❌ ERROR: formato de JSON no válido.\n')
            }
        } else if(command.startsWith('find book')){
            const title = command.replace('find book', '').trim();
            socket.write(BookController.findBook(title) + '\n');

        } else if(command.startsWith('delete book')){
            const title = command.replace('delete book', '').trim();
            socket.write(BookController.deleteBook(title) + '\n');
        }
            //----------------HASTA ACÁ LOS COMANDOS PARA "LIBROS".----------------//
        else if(command === 'get publishers'){
            const response = PublisherController.getPublishers();
            socket.write(response + '\n');

        } else if(command === 'add publisher'){
            const publisher = command.replace('add publisher', '').trim();
            socket.write(PublisherController.addPublisher(publisher) + '\n')

        } else if(command === 'find publisher'){
            const publisher = command.replace('find publisher', '').trim();
            socket.write(PublisherController.findPublisher(publisher) + '\n');
        }
            //----------------HASTA ACÁ LOS COMANDOS PARA "EDITORIALES".----------------//
          else if(command === 'get authors'){
            const authors = AuthorController.getAuthors();
            socket.write(authors + '\n');

        } else if(command === 'add author'){
            const response = command.replace('add author', '').trim();
            if(isJSON(response)){                                     
                const authorData = JSON.parse(response);                
                socket.write(AuthorController.addAuthor(authorData.name, authorData.nationality) + '\n');
            
            } else {
                socket.write('❌ ERROR: formato de JSON no válido.\n')
            }

        } else if(command === 'find author'){
            const response = command.replace('find author', '').trim();
            socket.write(AuthorController.findAuthor(response) + '\n');
        
        } else if(command === 'delete author'){
            const author = command.replace('delete author', '').trim()
            socket.write(AuthorController.deleteAuthor(author) + '\n');
        } 

            //----------------HASTA ACÁ LOS COMANDOS PARA "AUTORES".----------------//
    
    });

    socket.on('error', (err) => {
        socket.write(`❌ Ocurrió un error: ${err.message}\n`);
        console.error(err.message);
    });

    socket.on('end', () => {
        socket.write('👋 ¡Hasta luego!')
        console.log(`🔌 El cliente: ${clientId} se desconectó.`);
        
    });

    socket.on('close', () => {
        console.log('Sesión finalizada. ');
        
    });

});

server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto... ${PORT}`);
});




























import BookController from './controllers/booksController.js'
import BookModel from './models/booksModel.js';
import LibraryView from './views/viewResponse.js';

/*1. Obtener todos los libros
console.log('Obtener todos los libros: ');
console.log(BookModel.getBook());

// 2. Agregar un libro nuevo
console.log('Agregamos un libro nuevo: ');
const newBook = BookModel.addBook("El Principito", "Antoine de Saint-Exupéry", "Editorial XYZ", 1943);
console.log(newBook);

// 3. Buscar un libro por título
console.log('Buscamos un libro: ');
const foundBook = BookModel.findBook("El Principito");
console.log(foundBook);

// 4. Eliminar un libro por título
console.log('Eliminamos un libro: ');
const deletedBook = BookModel.deleteBook("El Principito");
console.log(deletedBook);*/

/* 1. Obtener todos los libros
console.log('Obtenemos todos los libros: ');
console.log(BookController.getBooks());

// 2. Agregar un libro
console.log('Agregamos libro: ');
console.log(BookController.addBook("El Principito", "Antoine de Saint-Exupéry", "Editorial XYZ", 1943));

// 3. Buscar un libro
console.log('Buscamos libro');
console.log(BookController.findBook("El Principito"));

// 4. Eliminar un libro
console.log('Eliminamos libro:');
console.log(BookController.deleteBook("El Principito"));*/

import net from 'net';
import readlineSync from 'readline-sync';

const PORT = 8080;
const HOST = '127.0.0.1';

const client = net.createConnection({port: PORT, host: HOST}, () => {
});

client.on('data', (data) => {
        const mensajeBienvenida = data.toString();
        console.log(mensajeBienvenida);
        showMenu()
    });

function showMenu(){
    while(true){
    console.log('\n === MENÚ PRINCIPAL === ');
    console.log('1. GET BOOKS (Listar todos libros)');
    console.log('2. ADD BOOK (Agregar libro)');
    console.log('3. FIND BOOK (Buscar libro)');
    console.log('4. DELETE BOOK (Eliminar libro)');
    console.log('5. GET AUTHORS (Listar todos los autores)');
    console.log('6. ADD AUTHOR (Agregar autor )');
    console.log('7. FIND AUTHOR (Buscar autor)');
    console.log('8. GET PUBLISHERS (Listar todas las editoriales) ');
    console.log('9. ADD PUBLISHER (Agregar una editorial)');
    console.log('10. FIND PUBLISHER (Buscar editorial)');
    console.log('0. EXIT (Salir)');

    const option = readlineSync.question('Ingresa el numero de la opcion deseada: ').trim();

    switch(option){

        case '1': 
            client.write('get books\n', 'utf-8');          
            break;

        case '2': 
            const title = readlineSync.question('Ingrese el titulo: ');
            const author = readlineSync.question('Autor: ');
            const publisher = readlineSync.question('Editorial: ');
            const year = readlineSync.question('Anio: ');
            const bookData = { title, author, publisher, year };
            client.write('add book ' + JSON.stringify(bookData) + '\n', 'utf-8');       //Creamos el JSON que el servidor espera.
            break;
    
        case '3':
            const findBook = readlineSync.question('Ingrese el titulo del libro: ');
            client.write(`find book ${findBook}\n`, 'utf-8')
            break;
        
        case '4':
            const deleteBook = readlineSync.question('Ingrese el titulo del libro que quiere eliminar: ');
            client.write(`delete book ${deleteBook}\n`, 'utf-8');
            break;

        case '5':
            client.write('get author s\n', 'utf-8');
            break;

        case '6':
            const name = readlineSync.question('Ingrese el nombre del autor: ');
            const nationality = readlineSync.question('Ingrese la nacionalidad del autor: ');
            const authorData = {name, nationality};
            client.write('add author ' + JSON.stringify(authorData) + '\n', 'utf-8');       //Creamos el JSON que el servidor espera
            break;
        
        case '7':
            const findAuthor = readlineSync.question('Ingrese el nombre del autor: ');
            const nationalityAuthor = readlineSync.question('Ingrese la nacionalidad del autor: ');
            const authorF = {findAuthor, nationalityAuthor}
            client.write('find author ' + JSON.stringify(authorF), 'utf-8');       
            break;

        case '8':
            client.write('get publishers\n', 'utf-8');
            break;

        case '9':
            const newPublisher = readlineSync.question('Ingrese el nombre de la editorial: ');
            const publisherData= {newPublisher}
            client.write(`add publisher ` + JSON.stringify(publisherData), 'utf-8');
            break;

        case '10':
            const findPublisher = readlineSync.question('Ingrese el nombre de la editorial: ');
            client.write(`find publisher ${findPublisher}` + '\n', 'utf-8');
            break;

        case '0':
            console.log('👋 Cerrando cliente...');
            client.end();
            process.exit(0);

        default : 
            console.log('❌ Comando no reconocido');
        }
    }
};

    client.on('error', (err) => {
        console.log('ERROR: ',err.message);
    });

   































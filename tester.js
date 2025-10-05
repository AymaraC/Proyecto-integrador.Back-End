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

/*import net from 'net';
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
    });*/


    const response = {
  name: "alfaguara",
  books: ["Libro 1 (1988)", "Libro 2 (1999)"]
};

// Simulamos cómo debería imprimir tu cliente
console.log('Editorial:', response.name);
console.log('Libros:');
response.books.forEach(b => console.log('-', b));


   
/*addBook : (title, authorName, publisherName, year) => {
        const bookData = fs.readFileSync(bookPath, 'utf-8');
        const authorData = fs.readFileSync(authorsPath, 'utf-8');
        const publishersData = fs.readFileSync(publishersPath, 'utf-8');

        const booksJson = JSON.parse(bookData);
        const authorsJson = JSON.parse(authorData);
        const publisherJson = JSON.parse(publishersData);

        let author = authorsJson.find(a => a.name.toLowerCase().trim() === authorName.toLowerCase().trim());
        
        if(!author){            //Sino existe el autor se agrega con un id aleatorio.
            author = {
                id: uuidv4(),
                name: authorName,
                nationality: nationality || 'desconocida'
            };
            authorsJson.push(author);  //Agregamos el autor al array
            fs.writeFileSync(authorsPath, JSON.stringify(authorsJson, null, 2), 'utf-8'); //Lo escribimos y guardamos de formato JS a JSON.
        };

        let publisher = publisherJson.find(e => e.name === publisherName);

        if(!publisher){
            publisher = {
                id: uuidv4(),
                name: publisherName
            }
            publisherJson.push(publisher);
            fs.writeFileSync(publishersPath, JSON.stringify(publisherJson, null, 2), 'utf-8')
        };

        const newBook = {
            id: uuidv4(),       //Agrega un ID único
            title,              
            authorId : author.id,
            publisherId: publisher.id,
            year
        };

        booksJson.push(newBook);        //Lo agregamos al array
        fs.writeFileSync(bookPath, JSON.stringify(booksJson, null, 2), 'utf-8');     //Escribimos el array

        console.log(`Libro "${title}" agregado con el autor "${author.name}" y nacionalidad "${author.nationality}".`);
        return newBook;  //Devolvemos el objeto con el libro agregado.
    },*/
/*MODELO QUE FUNCIONA
addAuthor : (name, nationality) => {
        const authorData = fs.readFileSync(authorsPath, 'utf-8');
        const authorJson = JSON.parse(authorData);
        
        let author = authorJson.find(a => a.name.toLowerCase().trim() === name.toLowerCase().trim());
        
        if(!author){
            author = {id: uuidv4(),             //Creamos un objeto
            name,
            nationality:nationality || 'desconocida'
        }
        
        authorJson.push(author)             //Agregamos el autor solo sino existía
        fs.writeFileSync(authorsPath, JSON.stringify(authorJson, null, 2), 'utf-8');
    };
        
        return author;  //Devuelve el objeto agregado.
    },
    
    CONTROLADOR QUE FUNCIONA
    addBook: (title, authorName, publisherName, year) => {
        const newBook = BookModel.addBook(title, authorName, publisherName, year);        
        if(!newBook){
            return LibraryView.formatResponse(`El libro ${title} ya se encuentra en nuestra biblioteca`);
        } else {
            return LibraryView.formatResponse(`📖 Libro ${newBook.title} agregado con éxito.`)
        }
    },
    SERVIDOR QUE FUNCIONA
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
                    );
                    socket.write(response + '\n', 'utf-8');

                } 
                
            } else {

                socket.write('❌ ERROR: formato de JSON no válido.\n', 'utf-8')
            }


    CLIENTE QUE FUNCIONA:
    function addBookFlow() {
    rl.question('Título: ', (title) => {
        if (!title.trim()) return console.log('❌ Título obligatorio') || showMenu();
        rl.question('Autor: ', (author) => {
            if (!author.trim()) return console.log('❌ Autor obligatorio') || showMenu();
            rl.question('Editorial: ', (publisher) => {
                if (!publisher.trim()) return console.log('❌ Editorial obligatoria') || showMenu();
                rl.question('Año: ', (year) => {
                    if (!year.trim() || isNaN(Number(year))) return console.log('❌ Año inválido') || showMenu();

                    client.write('add book ' + JSON.stringify({
                        title,
                        author,
                        publisher,
                        year
                    }));
                });
            });
        });
    });
}*/





























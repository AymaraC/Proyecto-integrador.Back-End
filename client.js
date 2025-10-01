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

    const option = readlineSync.question('Ingresa el número de la opción deseada: ')
    switch(option){

        case '1': 
            client.write('get books', 'utf-8');          //Enviamos el comando seleccionado al servidor
            client.once('data', (data) => {     //El listener once se ejecuta una sola vez cuando el socket recibe los datos del servidor.
                const response = JSON.parse(data.toString())
                console.log('\n 📚 Libros:\n', response.data);
                showMenu();
    });
            break;

        case '2': 
            const title = readlineSync.question('Ingrese el titulo: ');
            const author = readlineSync.question('Autor: ');
            const publisher = readlineSync.question('Editorial: ');
            const year = readlineSync.question('Año: ');
            const bookData = { title, author, publisher, year };
            
            client.write('add book' + JSON.stringify(bookData), 'utf-8');       //Creamos el JSON que el servidor espera.

            client.once('data', (data) => {
            console.log('\n' + data.toString());
            showMenu();
    });
            break;
    
        case '3':
            const findBook = readlineSync.question('Ingrese el titulo del libro: ');
            client.write(`find book ${findBook}`, 'utf-8')
            client.once('data', (data) => {
                console.log('\n📖 Libro:\n' + data.toString());
                showMenu();
            });
            break;
        
        case '4':
            const deleteBook = readlineSync.question('Ingrese el titulo del libro que quiere eliminar: ');
            client.write(`delete book ${deleteBook}`, 'utf-8');
            client.once('data', (data) => {
                console.log('\n' + data.toString());
                showMenu();
            });
            break;

        case '5':
            client.write('get authors', 'utf-8');
            client.once('data', (data) => {
                console.log('\n Autores: \n' + data.toString());
                showMenu();
            });
            break;

        case '6':
            const name = readlineSync.question('Ingrese el nombre del autor: ');
            const nationality = readlineSync.question('Ingrese la nacionalidad del autor ingresado: ');
            const authorData = {name, nationality};
            client.write('add author' + JSON.stringify(authorData), 'utf-8');       //Creamos el JSON que el servidor espera.

            client.once('data', (data) => {
            console.log('\n✅ Autor agregado con éxito' + data.toString());
            showMenu();
        });
            break;
        
        case '7':
            const findAuthor = readlineSync.question('Ingrese el nombre del autor: ');
            const nationalityAuthor = readlineSync.question('Ingrese la nacionalidad del autor: ');
            const authorF = {findAuthor, nationalityAuthor}
            client.write('find author' + JSON.stringify(authorF), 'utf-8');       

            client.once('data', (data) => {
            console.log('\n' + data.toString());
            showMenu();
        });
            break;

        case '8':
            client.write('get publishers', 'utf-8');
            client.once('data', (data) => {
                console.log('\n Editoriales: \n' + data.toString());
                showMenu();
        });
            break;

        case '9':
            const newPublisher = readlineSync.question('Ingrese el nombre de la editorial que quiere buscar: ');
            const publisherData= {publisher: newPublisher}
            client.write(`add publisher` + JSON.stringify(publisherData), 'utf-8');
            client.once('data', (data) => {
                console.log(`\nEditorial:\n` + data.toString());
                showMenu()
        });
            break;

        case '10':
            const findPublisher = readlineSync.question('Ingrese el nombre de la editorial: ');
            client.write(`find publisher ${findPublisher}`, 'utf-8');
            client.once(`data`, (data) => {
                console.log('\n Editorial encontrada:\n' + data.toString());
                showMenu();
        });
            break;
        case '0':
            console.log('👋 Cerrando cliente...');
            client.end();
            process.exit(0);
        default : 
            console.log('❌ Comando no reconocido');
            showMenu();
            break;
        }
};

    client.on('error', (err) => {
        console.log('ERROR: ',err.message);
    });

    client.on('close', () => {
        console.log('Sesión finalizada.');
    });

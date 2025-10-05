//Importamos los módulos necesarios, 'net' para crear la conexión TCP y readline para leer los inputs del usuario
import net from 'net';
import readline from 'readline';

const PORT = 8080;
const HOST = '127.0.0.1';

const client = net.createConnection({ port: PORT, host: HOST });

const rl = readline.createInterface({       //Creamos la interfaz de readline
    input: process.stdin,
    output: process.stdout
});

let ejecutando = true;              //Controlamos si el cliente sigue activo, evita mostrar el menú o procesar respuestas después de cerrar.

function showMenu() {               //Función que imprime el menú principal

    if(!ejecutando) return;

    console.log('\n === MENÚ PRINCIPAL === ');
    console.log('1. GET BOOKS');
    console.log('2. ADD BOOK');
    console.log('3. FIND BOOK');
    console.log('4. DELETE BOOK');
    console.log('5. GET AUTHORS');
    console.log('6. ADD AUTHOR');
    console.log('7. FIND AUTHOR');
    console.log('8. GET PUBLISHERS');
    console.log('9. ADD PUBLISHER');
    console.log('10. FIND PUBLISHER');
    console.log('0. EXIT');

    rl.question('Ingresa el número de la opción deseada: ', (option) => {
        handleOption(option.trim());
    });
}

function handleOption(option) {     //Función principal que ejecuta la acción según la opción del menú.
    switch (option) {
        case '1': 
            client.write('get books'); 
                break;
        case '2': 
            addBookFlow(); 
                break;
        case '3': 
            rl.question('Título a buscar: ', (title) => 
                client.write(`find book ${title}`));
                 break;
        case '4': 
            rl.question('Título a eliminar: ', (title) => 
                client.write(`delete book ${title}`)); 
                break;
        case '5': 
            client.write('get authors'); 
                break;
        case '6': 
            addAuthorFlow(); 
                break;
        case '7': 
           rl.question('Nombre del autor que desee buscar: ', (name) => {
            rl.question('Nacionalidad (opcional): ', (nationality) => {
                const authorF = {name, nationality: nationality || null};
                client.write('find author ' + JSON.stringify(authorF), 'utf-8'); 
                });
           });
           break;
        case '8': 
            client.write('get publishers'); 
                break;
        case '9': 
            addPublisherFlow(); 
                break;
        case '10': 
            rl.question('Nombre de la editorial a buscar: ', (name) => 
                client.write(`find publisher ${name}`)); 
                break;
        case '0': 
            console.log('👋 Cerrando cliente...');
            ejecutando = false;
                client.end();
                rl.close();
                break;        
        default: 
            console.log('❌ Opción no reconocida');
            showMenu();
    };
};

function addBookFlow() {            //Función que guía al usuario para ingresar los datos de un libro, 
                                    // valida que título, autor, editorial y año sean válidos.

    rl.question('Título: ', (title) => {         //Preguntamos al usuario por el título del libro.
        
        if (!title.trim())                      //Si el título está vacío o solo tiene espacios, muestra mensaje de error
                                                //y vuelve a mostrar el menú
            return console.log('❌ Título obligatorio') || showMenu();

        rl.question('Autor: ', (author) => {            //Preguntamos el nombre del autor
            if (!author.trim()) return console.log('❌ Autor obligatorio') || showMenu();

            rl.question('Nacionalidad del autor (opcional): ', (nationality) => {   //Preguntamos por la nacionalidad del autor, pero es opcional.

                rl.question('Editorial: ', (publisher) => {     //Preguntamos por el nombre de la editorial.
                    if (!publisher.trim()) return console.log('❌ Editorial obligatoria') || showMenu();

                    rl.question('Año: ', (year) => {        //Preguntamos por el año de publicación.
                        
                        if (!year.trim() || isNaN(Number(year))) //Hacemos un control de errores por si el año ingresado no es un número o que este vacío.
                            return console.log('❌ Año inválido') || showMenu();

                        client.write('add book ' + JSON.stringify({         //Envía los datos al servidor como JSON para que se agregue el libro.
                            title,
                            author,
                            nationality: nationality || null,
                            publisher,
                            year
                        }));
                    });
                });

            });
        });
    });
}


function addAuthorFlow() {
    rl.question('Nombre del autor: ', (name) => {
        if (!name.trim()) return console.log('❌ Nombre obligatorio') || showMenu();
        rl.question('Nacionalidad: ', (nationality) => {
            client.write('add author ' + JSON.stringify({ name, nationality }));
        });
    });
}

function addPublisherFlow() {
    rl.question('Nombre de la editorial: ', (name) => {
        if (!name.trim()) 
            return console.log('❌ Nombre obligatorio') || showMenu();
        client.write(`add publisher ${name}`, 'utf-8');
    });
}

client.on('data', (data) => {            // Evento que maneja la respuesta del servidor
    if(!ejecutando) return              //En esta línea le indicamos que no haga nada si se está cerrando.
    const responseStr = data.toString().trim();
    let response = responseStr;

    if (responseStr.startsWith('{') || responseStr.startsWith('[')) {        // Si es JSON, lo parseamos
        response = JSON.parse(responseStr);
    }

    if (response.books) {
        console.log('\nEditorial:', response.name);
        if (Array.isArray(response.books)) {
            console.log('Libros:');
            response.books.forEach(b => console.log('-', b));
        
        } else {
            console.log(response.books); 
        
        }
    } else {                                                    // cualquier otra respuesta (string o objeto)
        console.log('\n', response);
    }

    showMenu();
});


client.on('connect', () => {
    console.log('Conectando al servidor..');
});

client.on('error', (err) => {
    console.error('❌ ERROR: ', err.message)
});

client.on('end', () => {
    console.log('Conexión cerrada por el servidor.');
    ejecutando = false;
});


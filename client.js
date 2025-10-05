import net from 'net';
import readline from 'readline';

const PORT = 8080;
const HOST = '127.0.0.1';

const client = net.createConnection({ port: PORT, host: HOST });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let ejecutando = true;

function showMenu() {

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

function handleOption(option) {
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

function addBookFlow() {
    rl.question('Título: ', (title) => {
        if (!title.trim()) return console.log('❌ Título obligatorio') || showMenu();

        rl.question('Autor: ', (author) => {
            if (!author.trim()) return console.log('❌ Autor obligatorio') || showMenu();

            rl.question('Nacionalidad del autor (opcional): ', (nationality) => {

                rl.question('Editorial: ', (publisher) => {
                    if (!publisher.trim()) return console.log('❌ Editorial obligatoria') || showMenu();

                    rl.question('Año: ', (year) => {
                        if (!year.trim() || isNaN(Number(year))) return console.log('❌ Año inválido') || showMenu();

                        client.write('add book ' + JSON.stringify({
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

// Evento de datos del servidor
client.on('data', (data) => {
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

import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import {v4 as uuidv4} from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

const bookPath = path.join(__dirname, '../data/books.json');
const authorsPath = path.join(__dirname, '../data/authors.json'); //Los necesita para traducir los id a nombres. En vez de poner el ID pone el nombre del autor, de esta forma no se comparten los ID con el cliente y los libros pueden compartir autores y editoriales.
const publishersPath = path.join(__dirname, '../data/publishers.json');

const BookModel = {
    getBook : () => {
        const bookData = fs.readFileSync(bookPath, 'utf-8');
        const authorData = fs.readFileSync(authorsPath, 'utf-8');
        const publisherData = fs.readFileSync(publishersPath, 'utf-8');

        const bookJson = JSON.parse(bookData);
        const authorJson = JSON.parse(authorData);
        const publisherJson = JSON.parse(publisherData);

        if(bookJson.length === 0){                          //Lee el array de libros por si no hay ningún libro en la biblioteca.
            return [{message: "No hay libros disponibles."}]
        }

        const books = bookJson.map(book => {
            const author = authorJson.find(a => a.id === book.authorId);        //Recorre el array de autores y devuelve el primer autor(nombre) cuyo id coincida con book.autorId
            const publisher = publisherJson.find(e => e.id === book.editorialId);

            return `${book.title}\n -Autor: ${author ? author.name : 'Autor desconocido'} \n -Editorial: ${publisher ? publisher.name: 'Editorial desconocida'} \n -Año: ${book.year || 'Año no disponible'}`  //Sino encuentra el autor, la editorial o el año pone esos mensajes. 
        });

        return books;
    },

    addBook : (title, authorName, publisherName, year) => {
        const bookData = fs.readFileSync(bookPath, 'utf-8');
        const authorData = fs.readFileSync(authorsPath, 'utf-8');
        const publishersData = fs.readFileSync(publishersPath, 'utf-8');

        const booksJson = JSON.parse(bookData);
        const authorsJson = JSON.parse(authorData);
        const publisherJson = JSON.parse(publishersData);

        let author = authorsJson.find(a => a.name === authorName);
        if(!author){            //Sino existe el autor se agrega con un id aleatorio.
            author = {
                id: uuidv4(),
                name: authorName
            };
            authorsJson.push(author);  //Agregamos el autor al array
            fs.writeFileSync(authorsPath, JSON.stringify(authorsJson, null, 2)); //Lo escribimos y guardamos de formato JS a JSON.
        };

        let publisher = publisherJson.find(e => e.name === publisherName);

        if(!publisher){
            editorial = {
                id: uuidv4(),
                name: editorialName
            }
            publisherJson.push(publisher);
            fs.writeFileSync(publishersPath, JSON.stringify(publisherJson, null, 2))
        };

        const newBook = {
            id: uuidv4(),
            title,
            authorId : author.id,
            publisherId: publisher.id,
            year,
        };

        booksJson.push(newBook);
        fs.writeFileSync(bookPath, JSON.stringify(booksJson, null, 2));

        return `✅ Libro agregado con éxito: \n-${title}`
    },

    findBook : (title) => {
        const bookData = fs.readFileSync(bookPath, 'utf-8');
        const authorData = fs.readFileSync(authorsPath, 'utf-8');
        const publisherData = fs.readFileSync(publishersPath, 'utf-8');
        
        const bookJson = JSON.parse(bookData);
        const authorJson = JSON.parse(authorData);
        const publisherJson = JSON.parse(publisherData);
        
        const find = bookJson.find(t => t.title === title)
        if(!find){
            return 'No contamos con ese libro en la biblioteca.'
        } else {
            const author = authorJson.find(a => a.id === find.authorId);    //Traducimos el id a nombre para mostrarle al cliente la información.   
            const publisher = publisherJson.find(e => e.id === find.publisherId);
                
        return `Titulo: ${find.title}\nAutor: ${author ? author.name : 'Autor desconocido'}\nEditorial: ${publisher ? publisher.name : 'Editorial desconocida'}\nAño: ${find.year || 'Año no disponible'}`;

        }

    },

    deleteBook : (title) => {
        const bookData = fs.readFileSync(bookPath, 'utf-8');
        const booksJson = JSON.parse(bookData);

        const find = booksJson.find(b => b.title === title);
        if(!find){
            return `❌ No se encuentró el libro ${title} en nuestra biblioteca.`
        } else {
            const updateBooks = booksJson.filter(b => b.title !== title); //Filtramos los que no coinciden con el título.
            fs.writeFileSync(bookPath, JSON.stringify(updateBooks, null, 2));
            return `✅ Libro eliminado con éxito: ${title}`;
        };




    }
};

export default BookModel;












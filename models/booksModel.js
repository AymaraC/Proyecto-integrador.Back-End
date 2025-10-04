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
    getBook: () => {
   
    const bookData = fs.readFileSync(bookPath, 'utf-8');
    return JSON.parse(bookData); // Devuelve los datos crudos, libros con ID
    
    },

    addBook : (title, authorName, publisherName, year) => {
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
    },

    findBook : (title) => {

        const books = BookModel.getBook(); // usa getBook para tener los nombres
        return books.find(b => b.title.toLowerCase() === title.toLowerCase()) || null; //Devuelve el libro y sino lo encuentra devuelve null
    },

    deleteBook : (title) => {
        const bookData = fs.readFileSync(bookPath, 'utf-8');
        const booksJson = JSON.parse(bookData);

        const find = booksJson.find(b => b.title === title);
        if(!find){
            return null;
        }

        const deleted = booksJson.filter(b => b.title !== title);
        fs.writeFileSync(bookPath, JSON.stringify(deleted, null, 2), 'utf-8');
        return find;             //Devuelve el libro eliminado.
    }
};

export default BookModel;












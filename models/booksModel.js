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

      addBook: (title, authorName, publisherName, year, nationality) => {
        // Leemos los JSON
        const booksJson = JSON.parse(fs.readFileSync(bookPath, 'utf-8'));
        const authorsJson = JSON.parse(fs.readFileSync(authorsPath, 'utf-8'));
        const publishersJson = JSON.parse(fs.readFileSync(publishersPath, 'utf-8'));

        // Buscamos o agregamos el autor
        let author = authorsJson.find(a => a.name.toLowerCase().trim() === authorName.toLowerCase().trim());
        if (!author) {
            author = {
                id: uuidv4(),
                name: authorName,
                nationality: nationality || 'desconocida'
            };
            authorsJson.push(author);
            fs.writeFileSync(authorsPath, JSON.stringify(authorsJson, null, 2), 'utf-8');
        }

        // Buscamos o agregamos la editorial
        let publisher = publishersJson.find(p => p.name.toLowerCase().trim() === publisherName.toLowerCase().trim());
        if (!publisher) {
            publisher = {
                id: uuidv4(),
                name: publisherName
            };
            publishersJson.push(publisher);
            fs.writeFileSync(publishersPath, JSON.stringify(publishersJson, null, 2), 'utf-8');
        }

        // Creamos el libro con IDs correctos
        const newBook = {
            id: uuidv4(),
            title,
            authorId: author.id,
            publisherId: publisher.id,
            year
        };

        booksJson.push(newBook);
        fs.writeFileSync(bookPath, JSON.stringify(booksJson, null, 2), 'utf-8');

        return newBook;
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












import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import {v4 as uuidv4} from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

const bookPath = path.join(__dirname, '../data/books.json');
const authorsPath = path.join(__dirname, '../data/authors.json'); //Los necesita para traducir los id a nombres. En vez de poner el ID pone el nombre del autor, de esta forma no se comparten los ID con el cliente y los libros pueden compartir autores y editoriales.
const publishersPath = path.join(__dirname, '../data/publishers.json');

const normalizeText = (data) =>             //Función para normalizar el texto: espacios, tildes, mayusculas.
  data
    ?.normalize('NFD')                      //Separa letras y acentos
    .replace(/[\u0300-\u036f]/g, '')        //Elimina los acentos
    .toLowerCase()                          //Convierte todo a minusculas
    .trim();                                //Elimina espacios al principio y al final

const BookModel = {
    getBook: () => {
   
    const bookData = fs.readFileSync(bookPath, 'utf-8');         //Leemos el JSON de libros
    return JSON.parse(bookData);                                // Devuelve los datos crudos, libros con ID
    
    },

      addBook: (title, authorName, publisherName, year, nationality) => {
        const booksJson = JSON.parse(fs.readFileSync(bookPath, 'utf-8'));               //Leemos los json que necesitamos
        const authorsJson = JSON.parse(fs.readFileSync(authorsPath, 'utf-8'));
        const publishersJson = JSON.parse(fs.readFileSync(publishersPath, 'utf-8'));

        let author = authorsJson.find(a => normalizeText(a.name) === normalizeText(authorName));     //Buscamos el autor si el autor ya existe

        if (!author) {                                              //Sino existe, lo creamos
            author = {      
                id: uuidv4(),
                name: authorName,
                nationality: nationality || 'desconocida'
            };

            authorsJson.push(author);                           //Lo agregamos al array
            fs.writeFileSync(authorsPath, JSON.stringify(authorsJson, null, 2), 'utf-8');   //Lo guardamos en el array
        }

        let publisher = publishersJson.find(p => normalizeText(p.name) === normalizeText(publisherName));
        if (!publisher) {
            publisher = {
                id: uuidv4(),
                name: publisherName
            };
            
            publishersJson.push(publisher);
            fs.writeFileSync(publishersPath, JSON.stringify(publishersJson, null, 2), 'utf-8');
        }

            const exists = booksJson.some(b => normalizeText(b.title) === normalizeText(title)); //Verificamos que el libro no exista ya en nuestra biblioteca.
            
            if (exists) {
            return  null;

            }

        const newBook = {                   //Creamos el libro con IDs correctos
            id: uuidv4(),
            title : title.trim(),
            authorId: author.id,
            publisherId: publisher.id,
            year
        };

        booksJson.push(newBook);
        fs.writeFileSync(bookPath, JSON.stringify(booksJson, null, 2), 'utf-8');

        return newBook;                 //Devolvemos el libro agregado
    },

    findBook : (title) => {

        const books = BookModel.getBook();                      //Usamos getBook() para tener los nombres
        const normalizedTitle = normalizeText(title);
        return books.find(b => normalizeText(b.title) === normalizedTitle) || null;     //Buscamos el libro por título ya normalizado
    },

    deleteBook : (title) => {
        const bookData = fs.readFileSync(bookPath, 'utf-8');
        const booksJson = JSON.parse(bookData);
        const normalizedTitle = normalizeText(title);

        const find = booksJson.find(b => normalizeText(b.title) === normalizedTitle);       //Busca el primer elemento del array que cumpla con la condición y al mismo tiempo normaliza el texto.
        if(!find){
            return null;
        }

        const deleted = booksJson.filter(b => normalizeText(b.title) !== normalizedTitle);      //Creamos un array con todos los libros que cumplan la condición. Va a tener todos los libros que NO tengan el título que queremos borrar.
        fs.writeFileSync(bookPath, JSON.stringify(deleted, null, 2), 'utf-8');
        return find;             //Devuelve el libro que se borró para que el que llama a la función sepa cuál fue eliminado.
    }
};

export default BookModel;
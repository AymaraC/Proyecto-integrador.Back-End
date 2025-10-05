import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import {v4 as uuidv4} from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

const publisherPath = path.join(__dirname, '../data/publishers.json');
const bookPath = path.join(__dirname, '../data/books.json');

const normalizeText = (data) =>             //Función para normalizar el texto: espacios, tildes, mayusculas.
  data
    ?.normalize('NFD')                      //Separa letras y acentos
    .replace(/[\u0300-\u036f]/g, '')        //Elimina los acentos
    .toLowerCase()                          //Convierte todo a minusculas
    .trim();                                //Elimina espacios al principio y al final

const PublisherModel = {

    getPublishers : () => {
        const readFile = fs.readFileSync(publisherPath, 'utf-8');
        return JSON.parse(readFile);
    },

    addPublisher : (name) => {
        const readFile = fs.readFileSync(publisherPath, 'utf-8');
        const fileJson = JSON.parse(readFile);

        const normalizedName = normalizeText(name);

        let exists = fileJson.find(p => normalizeText(p.name) === normalizedName);     //Nos fijamos que no exista la editorial que quieren ingresar a nuestra biblioteca.

        if(exists){
            return null;      //Como ya existe devuelve null
        }

        const newPublisher = {              //Agregamos una nueva editorial
            id: uuidv4(),
            name: name.trim()        
        }
        
        fileJson.push(newPublisher);
        fs.writeFileSync(publisherPath, JSON.stringify(fileJson, null, 2), 'utf-8');
        return newPublisher;
    },

    findPublisher : (name) => {
        const readFile = fs.readFileSync(publisherPath, 'utf-8');
        const booksData = fs.readFileSync(bookPath, 'utf-8')
        const fileJson = JSON.parse(readFile);
        const book = JSON.parse(booksData);

        const normalizedName = normalizeText(name);
        const foundPublisher = fileJson.find(p => normalizeText(p.name) === normalizedName);      //Buscamos el nombre de la editorial ingresada por consola con el texto ya normalizado.  
        
        if(!foundPublisher){
            return null;
        }

        const books = book.filter(b => b.publisherId === foundPublisher.id)      
        
        return {...foundPublisher, books: books};
    }
};

export default PublisherModel;

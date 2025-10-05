import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import {v4 as uuidv4} from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const authorsPath = path.join(__dirname, '../data/authors.json');
const booksPath = path.join(__dirname, '../data/books.json');

const AuthorModel = {
    getAuthors : () => {
        const authorData = fs.readFileSync(authorsPath, 'utf-8');
        return JSON.parse(authorData);  //Devuelve un array de objetos.
    },

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
    
    findAuthor : (name, nationality) => {
        const authorData = fs.readFileSync(authorsPath, 'utf-8');
        const booksData = fs.readFileSync(booksPath, 'utf-8');
        const authorJson = JSON.parse(authorData);
        const booksJson = JSON.parse(booksData);

        let results = authorJson;       //Le asignamos el array con el los autores que se encuentran en nuestra biblioteca actualemente

        if(name){                       //Filtra por nombre 
            results= results.filter(a => a.name.toLowerCase().trim() === name.toLowerCase().trim());
        };

        if(nationality){                //Filtra por nacionalidad
        results = results.filter(a => a.nationality && a.nationality.toLowerCase().trim() === nationality.toLowerCase().trim());
        };

        results = results.map(a => {
            const booksByAuthor = booksJson.filter(b => b.authorId === a.id);
            return { ...a, books: booksByAuthor };
        });

        return results;         //Devuelve el array con los datos crudos.

    },

};

export default AuthorModel;















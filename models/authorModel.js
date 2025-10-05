import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import {v4 as uuidv4} from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const authorsPath = path.join(__dirname, '../data/authors.json');
const booksPath = path.join(__dirname, '../data/books.json');

const normalizeText = (data) =>          //Función para normalizar el texto: espacios, tildes, mayusculas.
  data          
    ?.normalize('NFD')                  //Separa letras y acentos
    .replace(/[\u0300-\u036f]/g, '')    //Elimina los acentos
    .toLowerCase()
    .trim();

const AuthorModel = {
    getAuthors : () => {
        const authorData = fs.readFileSync(authorsPath, 'utf-8');
        return JSON.parse(authorData);  //Devuelve un array de objetos.
    },

    addAuthor : (name, nationality) => {
        const authorData = fs.readFileSync(authorsPath, 'utf-8');
        const authorJson = JSON.parse(authorData);

        const normalizedName = normalizeText(name);               //Normalizamos las entradas
        const normalizedNationality = normalizeText(nationality);

        let author = authorJson.find(a =>                       // Buscamos si ya existe un autor con mismo nombre y nacionalidad
        normalizeText(a.name) === normalizedName &&
        normalizeText(a.nationality || 'desconocida') === normalizedNationality
    );
        
        if(!author) {
            author = {                                      //Creamos el autor sino existía
            id: uuidv4(),                            
            name : name.trim(),
            nationality:nationality || 'desconocida'
        };
        
        authorJson.push(author)             //Agregamos el autor solo sino existía
        fs.writeFileSync(authorsPath, JSON.stringify(authorJson, null, 2), 'utf-8');
    }
        
        return author;  //Devuelve el autor agregado o el que ya existe.
    },
    
    findAuthor : (name, nationality) => {
        const authorData = fs.readFileSync(authorsPath, 'utf-8');
        const booksData = fs.readFileSync(booksPath, 'utf-8');
        const authorJson = JSON.parse(authorData);
        const booksJson = JSON.parse(booksData);

        let results = authorJson;       //Le asignamos el array con el los autores que se encuentran en nuestra biblioteca actualemente

        if(name){                       //Filtra por nombre 
            const normalizedName = normalizeText(name);
            results = results.filter(a => normalizeText(a.name) === normalizedName);
        };

        if(nationality){                //Filtra por nacionalidad
            const normalizedNationality = normalizeText(nationality);
            results = results.filter(a => a.nationality && normalizeText(a.nationality) === normalizedNationality);
        };

        results = results.map(a => {
            const booksByAuthor = booksJson.filter(b => b.authorId === a.id);
            return { ...a, books: booksByAuthor };
        });

        return results;         //Devuelve el array con los datos crudos.

    },

};

export default AuthorModel;

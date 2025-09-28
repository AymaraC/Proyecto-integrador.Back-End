import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import {v4 as uuidv4} from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const authorsPath = path.join(__dirname, '../data/authors.json');

const AuthorModel = {
    getAuthors : () => {
        const authorData = fs.readFileSync(authorsPath, 'utf-8');
        return JSON.parse(authorData);  //Devuelve un array de objetos.
    },

    addAuthor : (name, nationality) => {
        const authorData = fs.readFileSync(authorsPath, 'utf-8');
        const authorJson = JSON.parse(authorData);
        
        let author = authorJson.find(a => a.name === name);
        
        if(!author){
            author = {id: uuidv4(),             //Creamos un objeto
            name,
            nationality
        }
    };
        authorJson.push(author)
        fs.writeFileSync(authorsPath, JSON.stringify(authorJson, null, 2));
        return author;  //Devuelve el objeto agregado.
    },
    
    findAuthor : (name, nationality) => {
        const authorData = fs.readFileSync(authorsPath, 'utf-8');
        const authorJson = JSON.parse(authorData);

        let results = authorJson;       //Le asignamos el array con el los autores que se encuentran en nuestra biblioteca actualemente

        if(name){               //Filtra por nombre en el caso de que se haya elegido nombre.
            results= results.filter(a => a.name === name);
        }

        if(nationality){        //Filtra por nacionalidad si fue elegida.
            results = results.filter(a => a.nationality === nationality);
        }

        return results;         //Devuelve el array de objetos sin formatear.

    },

    deleteAuthor : (name) => {
        const authorData = fs.readFileSync(authorsPath, 'utf-8');
        const authorJson = JSON.parse(authorData);

        let author = authorJson.find(a => a.name === name);

        if(!author){
            return null;  //Sino lo encontró devuelve null
        } else {
            const updateAuthors = authorJson.filter(a => a.name !== name); 
            fs.writeFileSync(authorsPath, JSON.stringify(updateAuthors, null, 2));
            return author;
        
        }
    }

};

export default AuthorModel;















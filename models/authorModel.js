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
        const authorJson = JSON.parse(authorData);
        if(authorJson.length === 0){
            return 'No hay autores disponibles.'
        } else {
            return authorJson.map(a => `Nombre: ${a.name} - Nacionalidad: ${a.nationality}`);
        };
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
        return `✅ Autor ${name} agregado con éxito.`
    },
    
    findAuthor : (name, nationality) => {
        const authorData = fs.readFileSync(authorsPath, 'utf-8');
        const authorJson = JSON.parse(authorData);
        let results = []
        if(name){
            results= authorJson.filter(a => a.name === name);
            
        } else if(nationality){
            results = authorJson.filter(n => n.nationality === nationality)
        
        } 

        if(results.length === 0){
            return `❌ No se encontró ningún criterio`;
        }

        return results.map(a => `Nombre: ${a.name} - Nacionalidad: ${a.nationality}`);

    },

    deleteAuthor : (name) => {
        const authorData = fs.readFileSync(authorsPath, 'utf-8');
        const authorJson = JSON.parse(authorData);
        let author = authorJson.find(a => a.name === name);
        if(!author){
            return `❌ No se encontró el autor ${name}`
        } else {
            const updateAuthors = authorJson.filter(a => a.name !== name); 
            fs.writeFileSync(authorsPath, JSON.stringify(updateAuthors, null, 2));
            return `✅ Autor ${name} eliminado con éxito.`
        
        }
    }

};

export default AuthorModel;















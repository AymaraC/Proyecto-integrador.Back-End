import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import {v4 as uuidv4} from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

const publisherPath = path.join(__dirname, '../data/publishers.json')

const PublisherModel = {

    getPublishers : () => {
        const readFile = fs.readFileSync(publisherPath, 'utf-8');
        const fileJson = JSON.parse(readFile);
        if(fileJson.length === 0){
            return `No hay editoriales disponibles.`
        } else {
            return fileJson.map(e => `Nombre: ${e.name}`);
        };
    },

    addPublisher : (name) => {
        const readFile = fs.readFileSync(publisherPath, 'utf-8');
        const fileJson = JSON.parse(readFile);
        let exists = fileJson.find(p => p.name === name);
        if(exists){
            return `La editorial ${name} ya existe en nuestra base de datos.`
        } else {
            const newPublisher = {
                id:uuidv4(),
                name
            };
            fileJson.push(newPublisher);
            fs.writeFileSync(publisherPath, JSON.stringify(fileJson, null, 2));
            return `✅ La editorial ${name} fue guardada con éxito.`
        };
    },

    findPublisher : (name) => {
        const readFile = fs.readFileSync(publisherPath, 'utf-8');
        const fileJson = JSON.parse(readFile);
        const findPublisher = fileJson.find(p => p.name === name);
        if(!findPublisher){
            return `No se encontró ninguna editorial con ese nombre.`
        } else {
            return `La editorial ${findPublisher.name} se encuentra en nuestra biblioteca.`
        };
    }
};

export default PublisherModel;















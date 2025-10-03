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
        return JSON.parse(readFile);
    },

    addPublisher : (name) => {
        const readFile = fs.readFileSync(publisherPath, 'utf-8');
        const fileJson = JSON.parse(readFile);
        
        let exists = fileJson.find(p => p.name === name);
        if(exists){
            return null;      //Como ya existe devuelve null
        }
        const newPublisher = {
            id: uuidv4(),
            name
        }
        fileJson.push(newPublisher);
        fs.writeFileSync(publisherPath, JSON.stringify(fileJson, null, 2), 'utf-8');
        return newPublisher;
    },

    findPublisher : (name) => {
        const readFile = fs.readFileSync(publisherPath, 'utf-8');
        const fileJson = JSON.parse(readFile);

        const findPublisher = fileJson.find(p => p.name === name);
        return findPublisher || null;
    }
};

export default PublisherModel;















import PublisherModel from "../models/publishersModel.js";
import LibraryView from "../views/viewResponse.js";

const PublisherController = {
    getPublishers : () => {
        const publishers = PublisherModel.getPublishers();

        if(publishers.length === 0){
            return LibraryView.formatResponse(`📰🚫 No hay editoriales disponibles.`)
        } else {
            return LibraryView.formatResponse(publishers)
        };
    },

    addPublisher : (name) => {
        const newPublisher = PublisherModel.addPublisher(name);
        if(!newPublisher){
            return LibraryView.formatResponse(`❌ La editorial '${name}' ya se encuentra registrada.`)
        } else {
            return LibraryView.formatResponse(`✅ Editorial ${name} agregada con éxito.`);
        }
    },

    findPublisher : (name, forClient = false) => {
        const found = PublisherModel.findPublisher(name);

        if(!found){
            const message = `🚫 La editorial ${name} no se encuentra en nuestra biblioteca.`
            return forClient ? { error: message } : LibraryView.formatResponse(message);
        }
        
        const bookList = found.books.length > 0 ? found.books.map(b => `${b.title} (${b.year})`) : '🚫 No hay libros registrados para esta editorial.'
    
        const publisherToView = {
            name: found.name,
            books: bookList
        }
        
        return forClient ? publisherToView : LibraryView.formatResponse(publisherToView);
    }
};

export default PublisherController;

















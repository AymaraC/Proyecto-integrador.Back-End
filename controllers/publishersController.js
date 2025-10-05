import PublisherModel from "../models/publishersModel.js";
import LibraryView from "../views/viewResponse.js";

const PublisherController = {
    getPublishers : () => {
        const publishers = PublisherModel.getPublishers();

        if(publishers.length === 0){
            return LibraryView.formatResponse(`📰🚫 No hay editoriales disponibles.`)
        } 
            const list = publishers.map((p, index) => {
                const name = p.name || 'Desconocida';
                return `${index + 1}. ${name}`;
            });
    
        return LibraryView.formatResponse(`🏢 Editoriales en nuestra biblioteca:\n` + list.join('\n'));

    },

    addPublisher : (name) => {
        const newPublisher = PublisherModel.addPublisher(name);
        
        if(!newPublisher){
            return LibraryView.formatResponse(`❌ La editorial '${name}' ya se encuentra registrada.`)
        
        } else {
            return LibraryView.formatResponse(`✅ Editorial '${name}' agregada con éxito.`);
        }
    },

    findPublisher : (name) => {
        const found = PublisherModel.findPublisher(name);

        if(!found){         //Sino encuentra la editorial, devuelve un mensaje de error
            const message = `🚫 La editorial '${name}' no se encuentra en nuestra biblioteca.`
            return LibraryView.formatResponse(message);
        }
        
        const bookList = found.books.length > 0 ? found.books.map((b, index) => //Si la editorial fue encontrada, generamos la lista de libros que pertenecen a esa editorial. 
            `${index + 1}.  ${b.title} (${b.year})`).join('\n')             //Si hay libros lo formateamos con índice y año.
            : '🚫 No hay libros registrados para esta editorial.'          //Sino hay libros, mostramos un mensaje indicando que no hay registros.
    
        const publisherToView = `📚 Editorial: ${found.name}\n📚 Libros:\n${bookList}`;
        
        return LibraryView.formatResponse(publisherToView);
    }
};

export default PublisherController;
import AuthorModel from "../models/authorModel.js";
import LibraryView from "../views/viewResponse.js";

const AuthorController = {
    getAuthors : () => {
        const authors = AuthorModel.getAuthors();
        
        if(authors.length === 0){
            return LibraryView.formatResponse('🪶🚫 No hay autores disponibles.')
        } else {
            return LibraryView.formatResponse(authors)
        }
    },

    addAuthor : (name, nationality) => {
        const newAuthor = AuthorModel.addAuthor(name, nationality);
        return LibraryView.formatResponse(`✅ Autor '${newAuthor.name}' agregado con éxito.`);
    }, 

    findAuthor : (name, nationality) => {
        const author = AuthorModel.findAuthor(name, nationality);
        
        if(author.length === 0){
            return LibraryView.formatResponse('❌ No se encontró ningún autor con esas caracteristicas.')
        }

        const authorsForClient = author.map(a => ({            //Le devuelve al cliente un objeto JSON crudo.
        name: a.name,
        nationality: a.nationality,
        books: a.books.length > 0 ? a.books.map(b => ({ title: b.title, year: b.year })) : []
        }));

        return authorsForClient;
    }
    
};

export default AuthorController;












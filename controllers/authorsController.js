import AuthorModel from "../models/authorModel.js";
import LibraryView from "../views/viewResponse.js";

const AuthorController = {
    getAuthors : () => {
        const authors = AuthorModel.getAuthors();
        
        if(authors.length === 0){
            return LibraryView.formatResponse('No hay autores disponibles.')
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

        return LibraryView.formatResponse(author);
    
    },

    deleteAuthor : (name) => {
        const deleted = AuthorModel.deleteAuthor(name);

        if(!deleted){
            return LibraryView.formatResponse(`No se encontró el autor ${name} en nuestra biblioteca.`)
        } else {
            return LibraryView.formatResponse(`✅ Autor '${name}' eliminado con éxito.`)
        }

    }

}

export default AuthorController;












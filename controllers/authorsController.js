import AuthorModel from "../models/authorModel.js";
import LibraryView from "../views/viewResponse.js";

const AuthorController = {
    getAuthors : () => {
        const authors = AuthorModel.getAuthors();
        
        if(authors.length === 0){
            return LibraryView.formatResponse('🪶🚫 No hay autores disponibles.')
        } else {
            const list = authors.map((a, index) => {
                const name = a.name || 'Desconocido';
                const nationality = a.nationality || '-';
                return `${index + 1}. ${name} | ${nationality}`;
            });

            return LibraryView.formatResponse(`👤 Autores en nuestra biblioteca:\n` + list.join('\n'));
        };
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

        const authorsForClient = author.map((a, index) => {
        const booksList = a.books.length > 0
        ? a.books.map((b, j) => `${j + 1}. ${b.title} (${b.year || b.publisherId || 'Año desconocido'})`).join('\n')
            : '🚫 No hay libros registrados para este autor.';

        return `👤 Autor: ${a.name} | 🌍 Nacionalidad: ${a.nationality || '-'}\n📚 Libros:\n${booksList}`;
    });

    return LibraryView.formatResponse(authorsForClient.join('\n\n'));

    }
}

export default AuthorController;












import AuthorModel from '../models/authorModel.js';
import BookModel from '../models/booksModel.js';
import PublisherModel from '../models/publishersModel.js';
import LibraryView from '../views/viewResponse.js';

const BookController = {
    getBooks : () => {      
        const books = BookModel.getBook()                           //Obtenemos todos los libros 
        
        if(!books || books.length === 0){
            return LibraryView.formatResponse('📖🚫 No hay libros disponibles.')
        };
        
        const booksList = books.map((b, index) => {
        const author = AuthorModel.getAuthors().find(a => a.id === b.authorId);
        const publisher = PublisherModel.getPublishers().find(p => p.id === b.publisherId);
        
        const authorName = author?.name || 'Desconocido';
        const publisherName = publisher?.name || 'Desconocida';
        const year = b.year || 'No especificado';

        return `${index + 1}. ${b.title} | ${authorName} | ${publisherName} | ${year}`;

    });
        return LibraryView.formatResponse(`📚 Listado de nuestros libros:\n` + booksList.join('\n'));        
    },

    addBook: (title, authorName, publisherName, year, nationality) => {
        const newBook = BookModel.addBook(title, authorName, publisherName, year, nationality);        
        if(!newBook){
            return LibraryView.formatResponse(`El libro ${title} ya se encuentra en nuestra biblioteca`);
        } else {
            return LibraryView.formatResponse(`📖 Libro ${newBook.title} agregado con éxito.`)
        }
    },

    findBook : (title) => {
        const book = BookModel.findBook(title);

        if(!book){
            return LibraryView.formatResponse(`El libro '${title}' no se encuentra en nuestra biblioteca.`)
        } else {
            const author = AuthorModel.getAuthors().find(a => a.id === book.authorId);
            const publisher = PublisherModel.getPublishers().find(p => p.id === book.publisherId);
            return LibraryView.formatResponse(`📚 Título: ${book.title} | Autor: ${author ? author.name : 'Desconocido'} | Editorial: ${publisher ? publisher.name : 'Desconocida'} | Año: ${book.year}`);
        };
        
    },

    deleteBook : (title) => {
        const deleted = BookModel.deleteBook(title);
        return LibraryView.formatResponse(`✅ Libro '${deleted.title}' eliminado con éxito.`);
    }

};

export default BookController;      //Exportamos el objeto para que otras apps puedan importarlo y utilizarlo.



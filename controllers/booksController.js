import AuthorModel from '../models/authorModel.js';
import BookModel from '../models/booksModel.js';
import PublisherModel from '../models/publishersModel.js';
import LibraryView from '../views/viewResponse.js';

const BookController = {
    getBooks : () => {      
        const books = BookModel.getBook()                           //Obtenemos todos los libros 
        const booksList = books.map(b => {
        const author = AuthorModel.getAuthors().find(a => a.id === b.authorId);
        const publisher = PublisherModel.getPublishers().find(p => p.id === b.publisherId);
     
    return {
        title: b.title,
        authorId: author ? author.name : 'Desconocido',      //Utilizamos la misma key que la vista espera
        publisherId: publisher ? publisher.name : 'Desconocida',
        year: b.year
        };
    });
        return LibraryView.formatResponse(booksList);         //Pasamos el array a la vista 
        

    },

    addBook : (title, authorName, publisherName, year) => {                         //Recibe la solicitud de agregar un libro.
        const newBook = BookModel.addBook(title, authorName, publisherName, year);  //Le pedimos al modelo que haga la operación necesaria.
        return LibraryView.formatResponse(`✅ El libro '${newBook.title}' fue agregado con éxito.`)
        
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



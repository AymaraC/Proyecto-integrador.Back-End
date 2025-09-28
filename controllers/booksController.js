import BookModel from '../models/booksModel.js';
import LibraryView from '../views/viewResponse.js';

const BookController = {
    getBooks : () => {                                 //Obtenemos todos los libros 
        const books = BookModel.getBook();            //Llamamos al objeto del modelo para obtener todos los libros.
        if(books.length === 0){
            return LibraryView.formatResponse('No hay libros en nuestra biblioteca');
        } else {
            const list = books.map(b => `${b.title} - ${b.authorName} - ${b.publisherName} - ${b.year}`).join('\n');
            return LibraryView.formatResponse(`Listado de libros disponibles:\n${list}`);
        };        

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
            return LibraryView.formatResponse(`Título: ${book.title}\n Autor: ${book.authorName}\nEditorial: ${book.publisherName}\nAño: ${book.year} 📚`);
        };
    },

    deleteBook : (title) => {
        const deleted = BookModel.deleteBook(title);
        return LibraryView.formatResponse(`✅ Libro '${deleted.title}' eliminado con éxito.`);
    }

};

export default BookController;      //Exportamos el objeto para que otras apps puedan importarlo y utilizarlo.














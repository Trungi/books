import { Book } from '../../types/book.types';


export interface BookService {
  
  createBook(book: Omit<Book, '_id'>): Promise<Book>;

  updateBook(_id: string, book: Omit<Book, '_id'>): Promise<Book>;

  getBook(_id: string): Promise<Book>;

  deleteBook(_id: string): Promise<boolean>;
}

import { Book } from '../../types/book.types';


export interface BookService {
  
  createBook(book: Omit<Book, '_id'>): Promise<Book>;

  updateBook(_id: string, book: Partial<Omit<Book, '_id'>>): Promise<Book>;

  getBook(_id: string): Promise<Book | null>;

  deleteBook(_id: string): Promise<boolean>;

  listBooks(opts?: ListBookOpts): Promise<Book[]>;
}

export type ListBookOpts = {
  skip?: number,
  limit?: number,
};

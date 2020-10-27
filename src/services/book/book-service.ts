import { Book, BookCreateRequest, BookUpdateRequest } from '../../types/book.types';


export interface BookService {
  
  createBook(book: BookCreateRequest): Promise<Book>;

  updateBook(id: string, book: BookUpdateRequest): Promise<Book>;

  getBook(id: string): Promise<Book | null>;

  deleteBook(id: string): Promise<boolean>;

  listBooks(opts?: ListBookOpts): Promise<Book[]>;
}

export type ListBookOpts = {
  skip?: number,
  limit?: number,
};

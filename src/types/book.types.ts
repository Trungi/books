
export type Book = {
  id: string,
  title: string,
  description: string,
  authors: string[],
};

export type BookCreateRequest = Omit<Book, 'id'>;
export type BookUpdateRequest = Partial<BookCreateRequest>;

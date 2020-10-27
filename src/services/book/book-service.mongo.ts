import { Collection, ObjectId } from 'mongodb';
import { v4 } from 'uuid';

import { Book, BookCreateRequest, BookUpdateRequest } from '../../types/book.types';
import { MongoService } from '../../utils/mongo-service';
import { BookService, ListBookOpts } from './book-service';


export class BookServiceMongo extends MongoService implements BookService {

  public static readonly collectionName = 'books';

  constructor(mongoUri: string, dbName: string) {
    super(mongoUri, dbName);
  }

  async ensureBookCollection(): Promise<Collection<Book>> {
    return this.ensureCollection(BookServiceMongo.collectionName);
  }

  async createBook(book: BookCreateRequest): Promise<Book> {
    const collection = await this.ensureBookCollection();
    const result = await collection.insertOne({
      ...book,
      id: v4(),
    });
    return removeMongoIds(result.ops[0]);
  }

  async updateBook(id: string, book: BookUpdateRequest): Promise<Book> {
    const collection = await this.ensureBookCollection();
    if (book['id']) delete book['id'];

    const result = await collection.findOneAndUpdate(
      { id },
      { $set: book },
      { returnOriginal: false, upsert: false }
    );

    if (result.value) return removeMongoIds(result.value);
    else throw new Error('book.not_found');
  }

  async getBook(id: string): Promise<Book | null> {
    const collection = await this.ensureBookCollection();
    const result = await collection.findOne({ id } as any);
    return removeMongoIds(result);
  }

  async deleteBook(id: string): Promise<boolean> {
    const collection = await this.ensureBookCollection();
    const result = await collection.deleteOne({ id } as any);
    return result.deletedCount === 1;
  }

  async listBooks(opts: ListBookOpts): Promise<Book[]> {
    const collection = await this.ensureBookCollection();
    const results = await collection.find({}, { skip: opts.skip, limit: opts.limit }).toArray();
    return removeMongoIds(results);
  }
}

// A bit hacky but I try to avoid having to use ObjectId with native mongodb client
function removeMongoIds(items: Book | Book[] | null) {
  if (!items) return items;
  if (Array.isArray(items)) return items.map(i => removeMongoIds(i));
  else {
    delete items['_id'];
    return items;
  }
}

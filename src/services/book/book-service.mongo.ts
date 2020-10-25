import { Collection } from 'mongodb';

import { Book } from '../../types/book.types';
import { MongoService } from '../../utils/mongo-service';
import { BookService } from './book-service';


export class BookServiceMongo extends MongoService implements BookService {

  public static readonly collectionName = 'books';

  constructor(mongoUri: string, dbName: string) {
    super(mongoUri, dbName);
  }

  async ensureBookCollection(): Promise<Collection<Book>> {
    return this.ensureCollection(BookServiceMongo.collectionName);
  }

  async createBook(book: Omit<Book, '_id'>): Promise<Book> {
    const collection = await this.ensureBookCollection();
    if (book['_id']) delete book['_id'];
    const result = await collection.insertOne(book as Book);
    return result.ops[0];
  }

  async updateBook(_id: string, book: Omit<Book, '_id'>): Promise<Book> {
    const collection = await this.ensureBookCollection();
    if (book['_id']) delete book['_id'];

    const result = await collection.findOneAndUpdate(
      { _id },
      { $set: book },
      { returnOriginal: false, upsert: false }
    );

    if (result.value) return result.value;
    else throw new Error('book.not_found');
  }

  async getBook(_id: string): Promise<Book> {
    const collection = await this.ensureBookCollection();
    return await collection.findOne({ _id });
  }

  async deleteBook(_id: string): Promise<boolean> {
    const collection = await this.ensureBookCollection();
    const result = await collection.deleteOne({ _id });
    return result.deletedCount === 1;
  }
}
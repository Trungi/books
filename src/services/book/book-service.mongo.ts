import { Collection, ObjectID, ObjectId } from 'mongodb';

import { Book } from '../../types/book.types';
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

  async createBook(book: Omit<Book, '_id'>): Promise<Book> {
    const collection = await this.ensureBookCollection();
    if (book['_id']) delete book['_id'];
    const result = await collection.insertOne(book as Book);
    return fixMongodbIds(result.ops[0]);
  }

  async updateBook(_id: string, book: Partial<Omit<Book, '_id'>>): Promise<Book> {
    const collection = await this.ensureBookCollection();
    if (book['_id']) delete book['_id'];

    const result = await collection.findOneAndUpdate(
      // @ts-ignore
      { _id: ObjectId(_id) },
      { $set: book },
      { returnOriginal: false, upsert: false }
    );

    if (result.value) return fixMongodbIds(result.value);
    else throw new Error('book.not_found');
  }

  async getBook(_id: string): Promise<Book | null> {
    const collection = await this.ensureBookCollection();
    const result = await collection.findOne({ _id });
    return fixMongodbIds(result);
  }

  async deleteBook(_id: string): Promise<boolean> {
    const collection = await this.ensureBookCollection();
    // @ts-ignore
    const result = await collection.deleteOne({ _id: ObjectId(_id) });
    return result.deletedCount === 1;
  }

  async listBooks(opts: ListBookOpts): Promise<Book[]> {
    const collection = await this.ensureBookCollection();
    const results = await collection.find({}, { skip: opts.skip, limit: opts.limit }).toArray();
    return fixMongodbIds(results);
  }
}

function fixMongodbIds(items: Book | Book[] | null) {
  if (!items) return items;
  if (Array.isArray(items)) return items.map(i => fixMongodbIds(i));
  else return { ...items, _id: items._id.toString() };
}

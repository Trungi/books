import { Db } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { BookService, BookServiceMongo } from '../../src/services/book';
import { connectMongoDb, startMongod } from '../mongod.utils';
import { bookFixtures } from './book-service.fixtures';


let mongod: MongoMemoryServer;
let db: Db;
let bookService: BookService;


beforeAll(async () => {
  mongod = await startMongod();
  db = await connectMongoDb(mongod);
  bookService = new BookServiceMongo(await mongod.getUri(), await mongod.getDbName());
}, 30000);

afterAll(async () => {
  await mongod.stop();
});

beforeEach(async () => {
  await db.createCollection(BookServiceMongo.collectionName);
  await db.collection(BookServiceMongo.collectionName).insertMany(bookFixtures);
});

afterEach(async () => {
  await db.collection(BookServiceMongo.collectionName).drop();
});

test('Get a book', async () => {
  const expectedBook = bookFixtures[0];
  const book = await bookService.getBook(expectedBook._id);
  expect(book).toEqual(expectedBook);
});


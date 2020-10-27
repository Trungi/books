import { Db } from 'mongodb';
const request = require('supertest');
import express from 'express';

import { createApi } from '../../src/api';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { BookService, BookServiceMongo } from '../../src/services/book';
import { connectMongoDb, startMongod } from '../mongod.utils';
import { bookFixtures } from './book-api.fixtures';
import { StatusCodes } from 'http-status-codes';


let mongod: MongoMemoryServer;
let db: Db;
let bookService: BookService;
let api: express.Application

beforeAll(async () => {
  mongod = await startMongod();
  db = await connectMongoDb(mongod);
  bookService = new BookServiceMongo(await mongod.getUri(), await mongod.getDbName());
  api = createApi(bookService);
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

test('List books', async (done) => {
  const response = await request(api).get('/api/book/');
  expect(response.status).toBe(StatusCodes.OK);
  expect(response.body).toMatchObject(bookFixtures);
  done();
});

test('Get a book', async (done) => {
  const book = bookFixtures[0];

  const response = await request(api).get(`/api/book/${book.id}`);
  expect(response.status).toBe(StatusCodes.OK);
  expect(response.body).toMatchObject(book);

  done();
});

test('Get nonexisting book', async (done) => {
  const book = bookFixtures[0];

  const response = await request(api).get(`/api/book/nonexisting`);
  expect(response.status).toBe(404);
  done();
});

test('Delete a book', async (done) => {
  const book = bookFixtures[0];
  
  const deleteResponse = await request(api).delete(`/api/book/${book.id}`);
  expect(deleteResponse.status).toBe(StatusCodes.NO_CONTENT);

  const retryResponse = await request(api).get(`/api/book/${book.id}`);
  expect(retryResponse.status).toBe(StatusCodes.NOT_FOUND);

  done();
});

test('Delete nonexisting book', async (done) => {
  const book = bookFixtures[0];
  
  const deleteResponse = await request(api).delete(`/api/book/nonexisting`);
  expect(deleteResponse.status).toBe(StatusCodes.NOT_FOUND);

  done();
});

test('Update a book', async (done) => {
  const book = bookFixtures[0];
  const title = 'New Book Title';
  
  const updateResponse = await request(api).put(`/api/book/${book.id}`).send({ title });
  expect(updateResponse.status).toBe(StatusCodes.OK);
  expect(updateResponse.body).toMatchObject({ ...book, title });

  done();
});

test('Update nonexisting book', async (done) => {
  const book = bookFixtures[0];
  const title = 'New Book Title';
  
  const updateResponse = await request(api).put(`/api/book/nonexisting`).send({ title });
  expect(updateResponse.status).toBe(StatusCodes.NOT_FOUND);

  done();
});

test('Update incorrect field in a book', async (done) => {
  const book = bookFixtures[0];
  const incorrectField = 'Wrong Field';
  
  const updateResponse = await request(api).put(`/api/book/${book.id}`, { incorrectField });
  expect(updateResponse.status).toBe(StatusCodes.UNSUPPORTED_MEDIA_TYPE);

  done();
});

test('Create a book', async (done) => {
  const book = {
    title: 'Clean code',
    description: 'A book about clean code',
    authors: ['Robert C. Martin'],
  };
  
  const created = await request(api).post(`/api/book/`).send(book);
  expect(created.status).toBe(StatusCodes.OK);
  expect(created.body).toMatchObject(book);

  done();
});


test('Create a book with incorrect field', async (done) => {
  const book = {
    title: 'Clean code',
    description: 'A book about clean code',
    authors: ['Robert C. Martin'],
    incorrectField: 'this is a wrong field',
  };
  
  const created = await request(api).post(`/api/book/`).send(book);
  expect(created.status).toBe(StatusCodes.BAD_REQUEST);
  done();
});

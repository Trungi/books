import * as express from 'express';
import * as OpenApiValidator from 'express-openapi-validator';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as yamljs from 'yamljs';
import * as swaggerUi from 'swagger-ui-express';
import { Router } from 'express';

import { StatusCodes } from 'http-status-codes';
import { Book } from './types/book.types';

import { BookService } from './services/book';


export function createApi(bookService: BookService) {
  const api: express.Application = express();

  // init swagger docs
  const apiSpec = path.join(__dirname, 'api.yaml');
  const swaggerDocument = yamljs.load(apiSpec);
  api.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  api.get('/', (req, res) => res.redirect('docs'));
  
  // init app middlewares
  api.use(bodyParser.json());
  api.use(
    OpenApiValidator.middleware({
      apiSpec,
      validateResponses: true, // default false
    }),
  );
  
  // init router
  const bookRouter = getApiBooksRouter(bookService);
  api.use('/api/book', bookRouter)

  return api;
}

export function getApiBooksRouter(bookService: BookService) {
  const router = Router();

  router.get('/', async (req, res) => {
    const skip = !!req.params.skip ? parseInt(req.params.skip, 10) : 0;
    const limit = !!req.params.limit ? parseInt(req.params.limit, 10) : 25;
    
    const list = await bookService.listBooks({ skip, limit });
    return res.json(list);
  });

  router.post('/', async (req, res) => {
    const book: Omit<Book, '_id'> = req.body;
    const createResult = await bookService.createBook(book);
    return res.json(createResult);
  });

  router.get('/:bookId', async (req, res) => {
    const book = await bookService.getBook(req.params.bookId);
    if (!book) res.sendStatus(StatusCodes.NOT_FOUND);
    else return res.json(book);
  });

  router.delete('/:bookId', async (req, res) => {
    const book = await bookService.getBook(req.params.bookId);
    if (!book) {
      res.sendStatus(StatusCodes.NOT_FOUND);
      return;
    }

    await bookService.deleteBook(req.params.bookId);
    return res.sendStatus(StatusCodes.NO_CONTENT);
  });

  router.put('/:bookId', async (req, res) => {
    const savedBook = await bookService.getBook(req.params.bookId);
    if (!savedBook) {
      res.sendStatus(StatusCodes.NOT_FOUND);
      return;
    }

    const book: Partial<Omit<Book, '_id'>> = req.body;
    const updateResult = await bookService.updateBook(req.params.bookId, book);
    return res.json(updateResult);
  });

  return router;
}

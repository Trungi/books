import * as express from 'express';
import { getApiBooksRouter } from './api-books.router';
import * as OpenApiValidator from 'express-openapi-validator';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as yamljs from 'yamljs';
import * as swaggerUi from 'swagger-ui-express';

import { getAppPort, getMongodbConfig } from './env';
import { BookService, BookServiceMongo } from './services/book';


// init services
// TODO: add dependency injection here
const mongoDbConfig = getMongodbConfig();
const bookService: BookService = new BookServiceMongo(mongoDbConfig.uri, mongoDbConfig.dbName);

const app: express.Application = express();

// init swagger docs
const apiSpec = path.join(__dirname, 'api.yaml');
const swaggerDocument = yamljs.load(apiSpec);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// init app middlewares
app.use(bodyParser.json());
app.use(
  OpenApiValidator.middleware({
    apiSpec,
    validateResponses: true, // default false
  }),
);

// setup routing
// TODO: book service would ideally be a class with injected deps
const bookRouter = getApiBooksRouter(bookService);
const apiRouter = express.Router();
apiRouter.use('/book', bookRouter)
app.use('/api', apiRouter);

app.get('/', (req, res) => res.redirect('/docs'));


// start api
const appPort = getAppPort();
app.listen(appPort, () => {
  console.log(`Server is listening on ${appPort}`);
  console.log(app.routes);
});


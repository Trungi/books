import { createApi } from './api';
import { getAppPort, getMongodbConfig } from './env';
import { BookService, BookServiceMongo } from './services/book';


// init services
// TODO: dependency injection would be better
const mongoDbConfig = getMongodbConfig();
const bookService: BookService = new BookServiceMongo(mongoDbConfig.uri, mongoDbConfig.dbName);

const api = createApi(bookService);

// start server
const appPort = getAppPort();
api.listen(appPort, () => {
  console.log(`Server is listening on ${appPort}`);
  console.log(api.routes);
});

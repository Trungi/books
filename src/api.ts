import * as express from 'express';
import { Server } from 'typescript-rest';

import { getAppPort } from './env';

let app = express();
Server.buildServices(app);
 
app.listen(getAppPort(), function() {
  console.log('Server is up');
});
 
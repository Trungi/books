import * as getPort from 'get-port';
import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

export async function startMongod(): Promise<MongoMemoryServer> {
  const port = await getPort();

  // start mongo
  const mongod = new MongoMemoryServer({
    instance: {
      dbName: 'books',
      ip: '127.0.0.1',
      port
    },
    autoStart: false
  });

  await mongod.ensureInstance();
  return mongod;
}

export async function connectMongoDb(mongod: MongoMemoryServer): Promise<Db> {
  // init mongo client
  const mongoUri = await mongod.getUri();
  const mongoConnect = await MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  return mongoConnect.db(await mongod.getDbName());
}

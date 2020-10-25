import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getMongodbConfig } from '../env';


export async function startMongod() {
  const { uri, dbName } = getMongodbConfig();

  const [, ip, port] = /^mongodb.*:\/\/(.*):(.*)$/.exec(uri) as RegExpExecArray;

  const mongod = new MongoMemoryServer({
    instance: {
      dbName,
      ip,
      dbPath: './.local/mongo',
      storageEngine: 'wiredTiger',
      port: parseInt(port, 10)
    },
  });

  const connectionString = await mongod.getUri();

  console.log(`MongoDB server started: ${connectionString}`);
}

export async function connectMongoDb(mongod: MongoMemoryServer): Promise<Db> {
  // init mongo client
  const mongoUri = await mongod.getUri();
  const mongoConnect = await MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  return mongoConnect.db(await mongod.getDbName());
}

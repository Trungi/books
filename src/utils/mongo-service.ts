import { Collection, Db, MongoClient } from 'mongodb';


export class MongoService {

  mongo: Db;
  
  constructor(private uri: string, private dbName: string) {}
  
  /**
   * Returns mongodb collection reference
   */
  async ensureCollection(name: string): Promise<Collection> {
    const mongo = await this.connectMongo();
    if (mongo) {
      return mongo.collection(name);
    } else {
      return Promise.reject('mongo not initialized');
    }
  }
  
  async connectMongo(): Promise<Db> {
    if (!this.mongo) {
      try {
        const mongoConnect = await MongoClient.connect(this.uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
        this.mongo = mongoConnect.db(this.dbName);
        console.log(`MongoDB connected to ${(<any>this.mongo.serverConfig).host}, ${this.mongo.databaseName}`);
        return this.mongo;
      } catch (err) {
        return Promise.reject(err);
      }
    } else {
      console.debug(`MongoDB already connected ...`);
      return this.mongo;
    }
  }
}

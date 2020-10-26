

export function getMongodbConfig() {
  return {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017',
    dbName: process.env.MONGODB_DATABASE || 'books',
  };
}

export function getAppPort() {
  return process.env.PORT || 4000;
}

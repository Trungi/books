# Books API

Used tools:
  - node, npm, Typescript
  - Express.js - common and easy to use server for node
  - MongoDB - easy to setup locally and run in cloud
  - OpenApi - for API request/response validation
  - Swagger-ui - since I used openAPI for validation, it's easier to use than postman ;)
  - Jest for testing
  - Github Actions - automatically runs build and test for CI
  - Heroku + Mongodb atlas for CD
  
## Deployment
Main branch of this app is automatically deployed to http://trungi-books.herokuapp.com/
  
## Installation
```sh
$ git clone git@github.com:Trungi/books.git
$ cd books/
$ npm install
```
## How to run
### Dev server:
Dev server automatically starts mongodb instance in localhost
```sh
$ npm run dev
```

### Deploy:
```sh
$ npm run build
```
You need to set up MONGODB_URI, MONGODB_DATABASE and PORT in environment, otherwise defaults defined in src/env.ts are used.

Startup:
```sh
$ npm run start
```

## What can be improved / next steps
- Sice API is now mapped 1to1 to book.service which might not always be the case, it would be good to separate unit and integrations tests
- Use tslint and/or prettier
- Setup dependency injection for services
- Typescript types can be generated from openapi schema

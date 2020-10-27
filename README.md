# Books API

Live version: http://trungi-books.herokuapp.com/docs

Used tools:
  - node, npm, Typescript
  - Express.js - common and easy to use server for node
  - MongoDB - easy to setup locally and run in cloud
  - OpenApi - for API request/response validation
  - Swagger-ui - since I used openAPI for validation, it's easier to use than postman ;)
  - Jest + supertest for testing
  - Github Actions - automatically runs build and test for CI
  - Heroku + Mongodb atlas for CD
  
## CI/CD
- All tests are automatically run using Github Actions
- Main branch of this app is automatically deployed to http://trungi-books.herokuapp.com/ (it may take ~20s for cold startup since I'm using a free dyno). MongoDB database is provided in MongoDB Atlas.
- You can browse this API in swagger docs: http://trungi-books.herokuapp.com/docs
  
## Installation
```sh
$ git clone git@github.com:Trungi/books.git
$ cd books/
$ npm install
```
## How to run
### Dev server:
```sh
$ npm run dev
```
This command automatically starts local mongodb instance with expressjs server running on port 4000 (or any other port specified by process.env.PORT)

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
- Better test support (right now there are only integration tests, we need some unit tests for services when app becomes larger)
- Add auth, preferably using JWT via Auth0 or AWS Cognito or issue custom JWT tokens
- Use tslint and/or prettier
- Setup dependency injection for services
- Typescript types can be generated from openapi schema

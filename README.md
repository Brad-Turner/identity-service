# Scalable web application

An example project for building a well formed typescript/node tech stack with scalability and maintainability in mind.

Technologies currently used in this project include;

- Typescript
- Express (HTTP server)
- Mongoose (MongoDB)
- Docker (Dockerfile and docker-compose)
- Jest (Testing)

### Todos

- Replace `console.log` statements with a production-grade logging library.
- Add support for clustering in `src/index.ts` file.
- Refine the safe shutdown procedures.
- Inside the Jest test suite, add a check for `docker-compose` to verify it is ready before test execution.
- Create an example mongoose model and add supporting express routes for data manipulation.
- Consolidate environment variables to one file.

# OAuth Service Provider

An example project for building a well formed typescript/node tech stack with scalability and maintainability in mind.

Technologies currently used in this project include;

- Typescript
- Express (HTTP server)
- Pg (PostgreSQL DB)
- Docker (Dockerfile and docker-compose)
- Jest (Testing)
- Pino (Logging)

## Getting Started

```sh
npm ci
cp .env.sample .env
npm run docker-up

# Open http://localhost:8080

npm run docker-down
npm test
```

### Todos

- Add support for clustering in `src/index.ts` file.
- Refine the safe shutdown procedures.
- Inside the Jest test suite, add a check for `docker-compose` to verify it is ready before test execution.
- Consolidate environment variables to one file.

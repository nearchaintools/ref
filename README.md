# Overview

Ref Status Explorer and Community Application
The application runs at https://ref.nearchaintools.com and is connected to NEAR blockchain mainnet data.
Project page with the To-Do section and collected feedback from the community could be found [here](https://imiroslav.notion.site/NearTools-com-for-Ref-Finance-a0ea6c5e68dd4a88acf1c2203e7bcef4)

# Instructions

## Backend Installation

### Install Dependencies

Install the dependencies for the application:


```bash
npm install
```

### PostgreSQL with Docker

Setup a development PostgreSQL with Docker. Follow `.env` which sets the required environments for PostgreSQL such as `POSTGRES_USER`, `POSTGRES_PASSWORD` and `POSTGRES_DB`. Update the variables as you wish and select a strong password.

Start the PostgreSQL database

```bash
docker-compose -f docker-compose.db.yml up -d
# or
npm run docker:db
```

### Prisma Migrate

[Prisma Migrate](https://github.com/prisma/prisma2/tree/master/docs/prisma-migrate) is used to manage the schema and migration of the database. Prisma datasource requires an environment variable `DATABASE_URL` for the connection to the PostgreSQL database. It takes variables from [.env](./.env) file which is also used by Prisma Migrate and for seeding the database. You can use [.env.example](./.env.example) to start with.

Use Prisma Migrate in your [development environment](https://www.prisma.io/blog/prisma-migrate-preview-b5eno5g08d0b#evolving-the-schema-in-development) to

1. Creates `migration.sql` file
2. Updates Database Schema
3. Generates Prisma Client

```bash
npx prisma migrate dev
# or
npm run migrate:dev
```

If you like to customize your `migration.sql` file run the following command. After making your customizations run `npx prisma migrate dev` to apply it.

```bash
npx prisma migrate dev --create-only
# or
npm run migrate:dev:create
```

If you are happy with your database changes you want to deploy those changes to your [production database](https://www.prisma.io/blog/prisma-migrate-preview-b5eno5g08d0b#applying-migrations-in-production-and-other-environments). Use `prisma migrate deploy` to apply all pending migrations, can also be used in CI/CD pipelines as it works without prompts.

```bash
npx prisma migrate deploy
# or
npm run migrate:deploy
```
### Seed the database data with this script

Execute the script with this command:

```bash
npm run seed
```

### Prisma: Prisma Schema Development

Update the Prisma schema `prisma/schema.prisma` and after that run the following two commands:

```bash
npx prisma generate
# or in watch mode
npx prisma generate --watch
# or
npm run prisma:generate
npm run prisma:generate:watch
```

### Prisma: Prisma Client JS

[Prisma Client JS](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/api) is a type-safe database client auto-generated based on the data model. It could be used for futher development

Generate Prisma Client JS by running

> **Note**: Every time you update [schema.prisma](prisma/schema.prisma) re-generate Prisma Client JS

```bash
npx prisma generate
# or
npm run prisma:generate
```

### Start NestJS Server


In case you would like to run API , you should deal with NestJS application. 

## Docker

Nest server is a Node.js application and it is easily [dockerized](https://nodejs.org/de/docs/guides/nodejs-docker-webapp/).

See the [Dockerfile](./Dockerfile) on how to build a Docker image of your Nest server.

Now to build a Docker image of your own Nest server simply run:

```bash
# give your docker image a name
docker build -t <your username>/nest-prisma-server .
# for example
docker build -t nest-prisma-server .
```

After Docker build your docker image you are ready to start up a docker container running the nest server:

```bash
docker run -d -t -p 3000:3000 --env-file .env nest-prisma-server
```

Now open up [localhost:3000](http://localhost:3000) to verify that your nest server is running.

When you run your NestJS application in a Docker container update your [.env](.env) file

```diff
- DB_HOST=localhost
# replace with name of the database container
+ DB_HOST=postgres

# Prisma database connection
+ DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DB_HOST}:${DB_PORT}/${POSTGRES_DB}?schema=${DB_SCHEMA}&sslmode=prefer
```

If `DATABASE_URL` is missing in the root `.env` file, which is loaded into the Docker container, the NestJS application will exit with the following error:

```bash
(node:19) UnhandledPromiseRejectionWarning: Error: error: Environment variable not found: DATABASE_URL.
  -->  schema.prisma:3
   |
 2 |   provider = "postgresql"
 3 |   url      = env("DATABASE_URL")
```
### Docker Compose

You can also setup a the database and Nest application with the docker-compose

First prepare `.env.production` file then run

```bash
# building new NestJS docker image
docker-compose build
# or
npm run docker:build

# start docker-compose
docker-compose up -d
# or
npm run docker
```

**[⬆ back to top](#overview)**


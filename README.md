# NestJS Prisma MySQL Todo

Simple Todo API using NestJS, Prisma, and MySQL.

## Setup

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

Set `DATABASE_URL` in `.env` to your MySQL database.

## Endpoints

- `GET /api/todos`
- `GET /api/todos/:id`
- `POST /api/todos` with `{ "title": "Buy milk" }`
- `PATCH /api/todos/:id` with `{ "title": "Buy oat milk", "completed": true }`
- `DELETE /api/todos/:id`

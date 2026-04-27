# K-Journal API

## Setup

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

## Endpoints

- `GET /`
- `GET /health`
- `GET /health/live`
- `GET /health/ready`
- `POST /auth/register` body: `{ "email": "...", "password": "...", "name": "..." }`
- `POST /auth/login` body: `{ "email": "...", "password": "..." }`
- `GET /users`

`GET /users` requires `Authorization: Bearer <token>`

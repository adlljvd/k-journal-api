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
- `GET /users`
- `POST /users` body: `{ "email": "...", "name": "..." }`

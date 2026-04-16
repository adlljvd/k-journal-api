# K-Journal Frontend

K-Journal is a modern journaling platform for K-Dramas and K-Movies built with:

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui-style reusable components
- Redux Toolkit
- TanStack Query
- Axios
- React Hook Form + Zod
- Framer Motion

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Routes

- `/` Home
- `/explore`
- `/content/[id]`
- `/journal`
- `/profile` (private profile UI)
- `/u/[username]` (public profile)
- `/login`
- `/register`

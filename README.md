# Portfolio Stack (Monorepo)

Full-stack portfolio application using:
- Angular (frontend)
- Express + TypeScript (backend)
- MongoDB (database)

## Repository structure

```text
portfolio-stack/
├─ apps/
│  └─ web/        # Angular app
├─ server/        # Express API (TypeScript)
├─ packages/      # Optional shared packages
└─ docker-compose.yml
```

## Prerequisites

- Node.js 20+ (Node 22 recommended)
- npm
- MongoDB (local or MongoDB Atlas)

## Quick start (local development)

### 1) Start MongoDB (optional if using local Docker)

```bash
docker compose up -d
```

If using Atlas, skip this and set `MONGODB_URI` in `server/.env`.

### 2) Configure and run backend

```bash
cd server
cp .env.example .env
# Edit .env values (MONGODB_URI, JWT_SECRET, etc.)
npm install
npm run seed
npm run dev
```

Backend runs at:
- API: `http://localhost:4000`
- Health check: `GET /api/health`

### 3) Run frontend

```bash
cd apps/web
npm install
npm start
```

Frontend runs at:
- App: `http://localhost:4200`

Dev proxy is already configured to forward `/api` to `http://localhost:4000`.

## Environment variables (backend)

Create `server/.env` from `server/.env.example`:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/portfolio_stack
JWT_SECRET=replace-with-strong-secret
CORS_ORIGIN=http://localhost:4200
ADMIN_SEED_EMAIL=admin@example.com
ADMIN_SEED_PASSWORD=ChangeMe123!
```

## Available scripts

### Frontend (`apps/web`)
- `npm start` - run Angular dev server
- `npm run build` - production build

### Backend (`server`)
- `npm run dev` - run API in watch mode
- `npm run build` - compile TypeScript
- `npm run start` - run compiled server
- `npm run seed` - seed initial admin + sample content

## Features

- Public portfolio sections: Home, About, Projects, Skills, Contact
- Dynamic hero metrics from API data
- Multi-theme UI with admin default and user override
- Contact form with success modal and MongoDB storage
- Admin panel with JWT auth and CRUD for content

## Deployment notes

- Frontend: Netlify or Vercel
- Backend: Render, Railway, or Fly.io
- Database: MongoDB Atlas

Before deploying:
- Use strong secrets in `.env`
- Set correct `CORS_ORIGIN`
- Do not commit `.env` or credentials

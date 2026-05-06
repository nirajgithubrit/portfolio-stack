# Portfolio Stack (Monorepo)

![CI](https://img.shields.io/github/actions/workflow/status/nirajgithubrit/portfolio-stack/ci.yml?branch=main&label=CI)
![License](https://img.shields.io/github/license/nirajgithubrit/portfolio-stack)
![Node](https://img.shields.io/badge/node-22.x-339933?logo=node.js&logoColor=white)
![Last Commit](https://img.shields.io/github/last-commit/nirajgithubrit/portfolio-stack)

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
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:4200
ADMIN_SEED_EMAIL=sataniniraj0000@gmail.com
ADMIN_SEED_PASSWORD=Niraj.portfolio@0503
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

## Deployments

### Frontend (Netlify)

This repo includes `netlify.toml` at root.

- Base directory: `apps/web`
- Build command: `npm ci && npm run build`
- Publish directory: `apps/web/dist/web/browser`

After backend is deployed, update this line in `netlify.toml`:

```toml
to = "https://your-render-service.onrender.com/api/:splat"
```

Replace with your real backend URL and redeploy Netlify.

### Backend (Render)

This repo includes `render.yaml` at root.

- Root directory: `server`
- Build command: `npm ci && npm run build`
- Start command: `npm run start`
- Health check: `/api/health`

### Backend (Railway alternative)

Use the `server` folder as service root:

- Build command: `npm ci && npm run build`
- Start command: `npm run start`
- Health check path: `/api/health`

## Production environment variables (backend)

Set these in Render/Railway dashboard:

- `MONGODB_URI` = your MongoDB Atlas URI
- `JWT_SECRET` = long random secret (min 32 chars)
- `JWT_EXPIRES_IN` = `7d` (or shorter, e.g. `12h`)
- `CORS_ORIGIN` = your Netlify domain (example `https://your-site.netlify.app`)
- `ADMIN_SEED_EMAIL` = admin email
- `ADMIN_SEED_PASSWORD` = strong password
- `PORT` = platform provided (or `4000`)
- `CLOUDINARY_CLOUD_NAME` = Cloudinary cloud name (optional, enables durable uploads)
- `CLOUDINARY_API_KEY` = Cloudinary API key
- `CLOUDINARY_API_SECRET` = Cloudinary API secret

Security notes:

- Never commit `.env`
- Rotate `JWT_SECRET` if leaked
- Use a dedicated MongoDB user with least privilege
- Restrict MongoDB Atlas network access

## API endpoints

| Method | Path | Purpose | Auth |
|---|---|---|---|
| GET | `/api/health` | Health check | No |
| POST | `/api/auth/login` | Admin login (returns JWT) | No |
| GET | `/api/projects` | List projects | No |
| POST | `/api/projects` | Create project | Yes (JWT) |
| PUT | `/api/projects/:id` | Update project | Yes (JWT) |
| DELETE | `/api/projects/:id` | Delete project | Yes (JWT) |
| GET | `/api/skills` | List skills | No |
| POST | `/api/skills` | Create skill | Yes (JWT) |
| PUT | `/api/skills/:id` | Update skill | Yes (JWT) |
| DELETE | `/api/skills/:id` | Delete skill | Yes (JWT) |
| GET | `/api/experience` | List experience | No |
| POST | `/api/experience` | Create experience | Yes (JWT) |
| PUT | `/api/experience/:id` | Update experience | Yes (JWT) |
| DELETE | `/api/experience/:id` | Delete experience | Yes (JWT) |
| POST | `/api/contact` | Submit contact form | No |
| GET | `/api/contact` | List contact messages | Yes (JWT) |
| GET | `/api/site-settings` | Get site settings | No |
| PUT | `/api/site-settings` | Update site settings | Yes (Admin JWT) |
| POST | `/api/uploads/site/profile` | Upload profile image | Yes (Admin JWT) |
| POST | `/api/uploads/site/logo` | Upload logo image | Yes (Admin JWT) |
| POST | `/api/uploads/site/resume` | Upload resume PDF | Yes (Admin JWT) |

## Deployment checklist (click-by-click)

1. Deploy backend on Render (or Railway) from this repo using `server` as root.
2. Set backend env vars and wait for healthy `/api/health`.
3. Copy backend public URL.
4. Edit `netlify.toml` API redirect target to backend URL.
5. Deploy frontend on Netlify from same repo.
6. Set `CORS_ORIGIN` in backend to your Netlify URL and redeploy backend.
7. Test:
   - home data loads
   - admin login works
   - contact form submit works
   - uploads from admin work

### Upload storage behavior

- If Cloudinary env vars are set, uploaded profile image/logo/resume are pushed to Cloudinary and permanent public URLs are saved.
- If Cloudinary is not configured, uploads fall back to local `uploads/` storage and are served via `/api/uploads-files` (local dev friendly, not durable in many cloud runtimes).

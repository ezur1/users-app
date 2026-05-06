# Users App

A full-stack app that fetches random users, lets you browse and filter them, save favourites to a local database, and edit their names.

## Live Deployment

- Client (Vercel): https://users-app-xi-sand.vercel.app/
- Server (Render): https://users-app-server-owny.onrender.com
- GitHub: https://github.com/ezur1/users-app

## Stack

| Layer | Tech |
|---|---|
| Frontend | Vue 3 + TypeScript + Vite |
| UI | PrimeVue 4 (Aura dark theme) |
| State | Pinia |
| Routing | Vue Router 4 |
| Backend | Express + TypeScript |
| Database | SQLite via Prisma |

## Prerequisites

- Node.js 20+
- npm 10+

## Install

```bash
# Install all dependencies (root + client + server)
npm run install:all
```

## Run Locally

```bash
# Run client + server in parallel from root
npm run dev
```

Client: `http://localhost:5173`  
Server: `http://localhost:3000`

## Build

```bash
npm run build
```

## Typecheck

```bash
npm run typecheck
```

## Tests

```bash
npm run test --prefix client
npm run test --prefix server
```

## Project structure

```
users-app/
├── client/   # Vue 3 frontend
└── server/   # Express + Prisma backend
```

## API

| Method | Path | Description |
|---|---|---|
| GET | /api/random-users | Proxy — fetches 10 users from randomuser.me |
| GET | /api/users | All DB-saved users |
| POST | /api/users | Save a user |
| PUT | /api/users/:id | Update user name |
| DELETE | /api/users/:id | Delete a user |

## Assignment Note: RandomUser fetch

The app fetches random users through the backend endpoint (`/api/random-users`) rather than calling `randomuser.me` directly from the browser. This keeps external API integration in one place, avoids CORS-related frontend coupling, and still satisfies the requirement to use `randomuser.me` as the source for 10 users.

## Deployment Notes

- Frontend uses `VITE_API_BASE_URL` to call the deployed backend.
- Backend uses `PORT` (provided by Render) and `CLIENT_URL` for CORS origin.
- Backend build includes Prisma migration deploy, so the SQLite schema is created automatically in cloud builds.

## Tradeoff

SQLite is used to keep setup minimal and align with assignment scope. For a production-scale multi-instance deployment, a managed database (for example PostgreSQL) is recommended.

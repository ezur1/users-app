# Users App

A full-stack app that fetches random users, lets you browse and filter them, save favourites to a local database, and edit their names.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Vue 3 + TypeScript + Vite |
| UI | PrimeVue 4 (Aura dark theme) |
| State | Pinia |
| Routing | Vue Router 4 |
| Backend | Express + TypeScript |
| Database | SQLite via Prisma |

## Getting started

```bash
# Install all dependencies (root + client + server)
npm run install:all

# Start both dev servers in parallel
npm run dev
```

- Client: http://localhost:5173  
- Server: http://localhost:3000

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

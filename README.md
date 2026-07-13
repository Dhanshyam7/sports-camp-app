This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Sports Camp Management

Web app for managing college sports camp attendance, drills, match schedules, and camp timings across
12 sports, with role-based access for students, coaches, sport coordinators, the PE HOD, and an admin.

## Stack

- Next.js 16 (App Router, TypeScript, Tailwind CSS)
- PostgreSQL via Prisma 7 (`prisma-client` generator + `@prisma/adapter-pg`)
- Auth.js (NextAuth v5) with a Credentials provider (username + password, bcrypt-hashed; email is
  collected separately at registration but isn't used to log in)

## Roles

- **Student** – registers, requests to join a sport, marks own attendance, views drills/matches/camp timing.
- **Coach** (per sport) – views the roster's attendance, posts drills, schedules matches, sets camp
  timing for any date (past, today, or future), marks own attendance.
- **Coordinator** (per sport) – marks/edits today's player attendance (timestamped), approves/rejects
  enrollment requests, can add a student directly.
- **HOD** – everything a coach/coordinator can do, for every sport, plus add/delete sports and
  add/remove players from any roster.
- **Admin** – app-level login statistics (per user and per sport) and creates coach/coordinator/HOD
  accounts.

## Local development

This project uses Prisma's local dev Postgres server (`prisma dev`), so no separate Postgres/Docker
install is required for local development.

```bash
npm install
npx prisma dev --detach --name sportscamp   # starts a local Postgres, prints a DATABASE_URL
# copy that DATABASE_URL (and the shadow one, see below) into .env if the ports differ from what's there
npx prisma db push                          # sync schema (migrate dev's shadow-db reset isn't reliable
                                             # against this lightweight local server; db push works)
npx prisma db seed                          # seeds the 12 sports + demo accounts
npm run dev
```

For a real deployment, point `DATABASE_URL` at a real PostgreSQL instance and use
`npx prisma migrate deploy` instead of `db push` (a baseline migration already exists under
`prisma/migrations/`).

## Deploying (Vercel + Neon, both free tier)

1. **Database — [Neon](https://neon.tech):** sign up, create a project, and copy the pooled connection
   string it gives you (starts with `postgresql://...`, includes `?sslmode=require`). That's your
   `DATABASE_URL`.
2. Apply the schema to that database once, from your machine:
   ```bash
   DATABASE_URL="<paste Neon connection string>" npx prisma migrate deploy
   DATABASE_URL="<paste Neon connection string>" npx prisma db seed   # optional: seed demo accounts
   ```
3. **App — [Vercel](https://vercel.com):** sign up, "Add New Project", import this repo (push it to
   GitHub first if it isn't already). Vercel auto-detects Next.js — no build config changes needed.
4. In the Vercel project's **Settings → Environment Variables**, add:
   - `DATABASE_URL` — the same Neon connection string
   - `AUTH_SECRET` — a random secret, generate with `openssl rand -base64 32` (never reuse the local dev
     one)
5. Deploy. Vercel runs `npm install` (which triggers `prisma generate` via `postinstall`) then
   `next build`. `AUTH_URL` is not needed on Vercel — the app trusts the request host automatically.
6. Once live, log in with the seeded accounts (see below) or register a new student, then use the Admin
   account to create real Coach/Coordinator/HOD accounts and change/remove the seeded demo passwords.

### Seeded accounts

All seeded accounts share the password `ChangeMe@123` — change these before any real use.

| Role | Username |
| --- | --- |
| Admin | `admin` |
| HOD | `hod` |
| Coach (Football) | `coach_football` |
| Coordinator (Football) | `coordinator_football` |
| Student (demo, approved in Football) | `student_demo` |

New students self-register at `/register` (name, username, email, semester, department, phone, DOB, KTU
ID). The username is checked for uniqueness at registration (and when an Admin creates a staff account) —
if it's taken, the form asks for a different one. Login uses username + password, not email. After
registering, a student requests to join a sport; a coordinator for that sport approves or rejects the
request, or can add a student directly by KTU ID/email.

Coach/Coordinator/HOD accounts are created by the Admin under **Staff Accounts**.

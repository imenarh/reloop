# ReLoop

A second hand marketplace to allow users to resell or donate their items. 

- **Demo Video**: https://www.loom.com/share/e8cf422f99e646108d93c295bcf6ad24
- **Project Board**: https://github.com/users/imenarh/projects/4

## Core Features

- **Sell or donate:** a seller creates one listing and chooses a `disposalType` of `resale` (priced) or `donation` (free); the item is the same entity either way.
- **Buy:** a buyer pays through Flutterwave; the transaction is re-verified server-side before the order is recorded and the listing is marked sold.
- **Donate:** a user applies to register an organization; an admin approves or rejects it; only the org's owner can claim donation listings on its behalf once approved.
- **Admin:** `/admin/organizations` lists pending applications for an admin (`user.role === 'admin'`) to approve or reject.


## Stack

- Next.js (App Router) + React
- TypeScript
- PostgreSQL + Drizzle ORM
- Zod
- Better Auth
- Cloudflare R2 
- Flutterwave
- Tailwind CSS + shadcn/ui
- Bun (Package manager and runtime)

## Getting started

```bash
bun install
```

Create `.env` with:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Session signing (32+ chars) |
| `BETTER_AUTH_URL` | App base URL (optional locally, needed in production) |
| `RESEND_API_KEY`, `EMAIL_FROM` | Email OTP delivery |
| `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL` | Cloudflare R2 image storage |
| `FLW_SECRET_KEY` | Flutterwave server-side transaction verification |
| `NEXT_PUBLIC_FLW_PUBLIC_KEY` | Flutterwave client-side checkout widget |

Apply the database schema, then run the dev server:

```bash
bun run db:migrate
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start the dev server (Turbopack) |
| `bun run build` | Production build |
| `bun run db:generate` | Generate a migration from schema changes |
| `bun run db:migrate` | Apply migrations to the database |
| `bun run db:studio` | Open Drizzle Studio |
| `bun run lint` | Lint |

## Project structure

- `actions/`: Server Actions (all mutations and most reads). Every action re-derives the caller via `requireUser()`/`requireAdmin()` in `lib/session.ts` before touching the database.
- `app/`: routes (App Router)
- `components/`: UI, grouped by feature (`listings/`, `organizations/`, `admin/`, `ui/` for shared primitives)
- `db/`: Drizzle schema and migrations
- `lib/`: validators, auth, session guards, shared types

## Known limitations

- Organizations currently support a single owner (`organizations.createdBy`), not multiple representatives.
- No buyer/seller messaging or delivery logistics.
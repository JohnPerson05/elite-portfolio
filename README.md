# John Person Narral — Portfolio

A production-oriented portfolio and lightweight CMS built with Next.js 16,
TypeScript, Tailwind CSS, Framer Motion, Prisma, and PostgreSQL.

## Features

- Recruiter-focused homepage with projects, skills, experience, references,
  writing, contact, and resume download
- Protected owner CMS for projects, posts, contacts, and analytics
- Server Actions with Zod validation, rate limiting, and signed sessions
- Open Graph/Twitter metadata, JSON-LD, sitemap, and robots directives
- Reduced-motion support, optimized images, keyboard navigation, and responsive
  layouts
- Vitest unit/integration tests, Playwright end-to-end tests, axe checks, and
  Lighthouse CI budgets

## Local setup

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Copy `.env.example` to `.env` and set:
   - `DATABASE_URL`: Neon/PostgreSQL connection string
   - `ADMIN_EMAIL`: owner login email
   - `ADMIN_PASSWORD_HASH`: generated with
     `npm run auth:hash -- "your-password"`
   - `AUTH_SECRET`: a long random signing secret
   - `NEXT_PUBLIC_SITE_URL`: canonical deployed URL

3. Initialize and seed the database:

   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

Open `http://localhost:3000`; the CMS is at `/admin/login`.

## Quality checks

```bash
npm test
npm run typecheck
npm run build
npm run test:e2e
npm run lighthouse
```

Install Playwright's Chromium runtime once with
`npx playwright install --with-deps chromium`.

The admin publishing E2E flow only runs when `E2E_ADMIN_EMAIL` and
`E2E_ADMIN_PASSWORD` are defined. Use a dedicated test database because the
flow creates and then removes a temporary project.

## Deploy to Vercel

Import the repository into Vercel, configure the five environment variables
listed above for Production and Preview, and deploy. The included
`vercel.json` uses `npm ci` and the production Next.js build. Run migrations
against the production database before the first deployment.

Primary public copy lives in `src/features/hero/config.ts`; curated database
content lives in `prisma/seed-data.ts`. Add verified social links and confirm
the resume before production launch.

# Md Al Amin Sikander — Portfolio

Personal portfolio for **Md Al Amin Sikander**: Software QA Engineer, SEO Specialist, and Management & Operations professional.

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Motion for React, Lucide icons, Zod, Nodemailer, Drizzle ORM (Neon Postgres), and Vercel Blob.

## Features

**Public site**

- Portfolio home page: Hero, What I Do, About, Experience, Skills, Projects, Education, latest blog posts, Contact, and Footer
- Project detail pages at `/projects/[slug]` with gallery, write-up, and related projects
- Blog at `/blog` with search, category filters, pagination, and empty states; articles at `/blog/[slug]` with reading time, share links, related posts, and breadcrumbs
- Sticky navbar that highlights the section in view (works from any page), animated mobile menu, scroll progress, back-to-top button
- Scroll-triggered reveals and parallax that respect `prefers-reduced-motion`
- Working contact form (Zod validation, SMTP via Nodemailer, honeypot, timing and link checks, rate limiting)

**Admin dashboard (`/admin`)**

- Email + password sign-in with database sessions, logout, and login rate limiting
- Overview: totals, draft vs. published counts, and recent updates
- Full create/edit/delete for **work experience**, **projects** (publish/unpublish, featured, image + gallery uploads), **skills and skill categories** (reorder controls), **blog posts** (Markdown editor with live preview, full-page preview, draft/publish/schedule, SEO fields), and **site settings** (profile, about text, contact, social links, photo, CV, SEO defaults, footer links, logo, favicon)
- Search and status filters, confirmation dialogs, unsaved-changes warnings, inline validation, loading skeletons, and toast feedback
- Collapsible sidebar on desktop, drawer navigation on mobile

**SEO**

- Per-page titles, meta descriptions, canonical URLs, Open Graph and Twitter cards (custom per article/project, with a generated default image at `/og`)
- JSON-LD: `Person`, `WebSite`, `ProfilePage`, `Blog`, `BlogPosting`, `CreativeWork`, and `BreadcrumbList`
- Dynamic `sitemap.xml` with only published projects and posts; `robots.txt` disallows `/admin` and `/api/`
- Admin pages are `noindex` (meta tag and `X-Robots-Tag` header); search-result pages are `noindex, follow`
- Server-rendered content (articles never require JavaScript to read), semantic headings, required alt text for uploaded images, responsive `next/image` sizing, and lazy loading below the fold

## Architecture

```
Visitor ──> Public pages (static, revalidated hourly + on every admin change)
               └─ src/lib/content.ts  (published content only)
Admin ────> src/proxy.ts (optimistic cookie check → /admin/login)
               └─ /admin pages ──> requireAdmin()  (validates the session in the database)
               └─ Server Actions ─> adminAction(): authorize → Zod validate → write → revalidatePath
               └─ /api/admin/upload ─> authorize + same-origin check → type/size/magic-byte checks → Vercel Blob
Database: Neon Postgres (Drizzle ORM)      Files: Vercel Blob (public store)
```

When `DATABASE_URL` is not set, the public site falls back to the original content in `src/data/`, so the site keeps working before the database is provisioned. The admin requires the database.

## Getting started (local)

Requirements: Node.js 20.9 or newer and a Postgres database (Neon or local).

```bash
npm install
cp .env.example .env.local      # then edit the values
npm run db:migrate              # create the tables
npm run db:seed                 # copy the current portfolio content into the database
npm run admin:create            # create the admin account from ADMIN_EMAIL / ADMIN_PASSWORD
npm run dev                     # http://localhost:3000 — admin at /admin
```

| Command                | Purpose                                                             |
| ---------------------- | ------------------------------------------------------------------- |
| `npm run dev`          | Development server                                                  |
| `npm run build`        | Production build                                                    |
| `npm run start`        | Serve the production build                                         |
| `npm run lint`         | ESLint (Next.js rules)                                              |
| `npm run typecheck`    | TypeScript type check                                               |
| `npm run db:generate`  | Generate a new SQL migration after changing `src/db/schema.ts`      |
| `npm run db:migrate`   | Apply migrations in `drizzle/` to `DATABASE_URL`                    |
| `npm run db:seed`      | Insert the original content into **empty** tables (safe to re-run)  |
| `npm run db:studio`    | Browse the database with Drizzle Studio                             |
| `npm run admin:create` | Create the admin account, or reset its password                     |

## Environment variables

| Variable                | Required                     | Description                                                                                          |
| ----------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`  | Yes (production)             | Public URL, e.g. `https://alaminsikander.com`. Used for canonical URLs, Open Graph, and the sitemap. |
| `DATABASE_URL`          | Yes (admin, blog)            | Postgres connection string. Neon URLs use the Neon serverless HTTP driver automatically.             |
| `BLOB_READ_WRITE_TOKEN` | Yes (uploads in production)  | Vercel Blob token. Without it, uploads are rejected in production.                                   |
| `ADMIN_EMAIL`           | Setup only                   | Email for `npm run admin:create`.                                                                     |
| `ADMIN_PASSWORD`        | Setup only                   | Password for `npm run admin:create` (min. 12 characters). Remove it after running the script.        |
| `ADMIN_NAME`            | Optional                     | Display name for the admin greeting.                                                                 |
| `SMTP_HOST`             | For contact form             | SMTP server host                                                                                     |
| `SMTP_PORT`             | For contact form             | `465` (SSL) or `587` (STARTTLS)                                                                      |
| `SMTP_USER`             | For contact form             | SMTP username                                                                                        |
| `SMTP_PASS`             | For contact form             | SMTP password or app password                                                                        |
| `SMTP_FROM`             | Recommended                  | Sender, e.g. `"Portfolio Contact <you@gmail.com>"`. Defaults to `SMTP_USER`.                         |
| `CONTACT_EMAIL`         | Optional                     | Recipient. Defaults to the email in admin Settings.                                                  |

All variables except `NEXT_PUBLIC_SITE_URL` are server-only and never sent to the browser. Never commit `.env.local`.

## Deployment on Vercel (database and storage setup)

1. **Install the CLI and link the project**

   ```bash
   npm i -g vercel
   vercel link
   ```

2. **Add Neon Postgres** — in the Vercel dashboard open the project → **Storage** → **Create Database** → **Neon** (or run `vercel integration add neon`). Connect it to all environments. This adds `DATABASE_URL`.

3. **Add Vercel Blob** — **Storage** → **Create** → **Blob**, connect it to the project. This adds `BLOB_READ_WRITE_TOKEN`.

4. **Set the remaining variables** in **Settings → Environment Variables**: `NEXT_PUBLIC_SITE_URL` (your real domain) and the SMTP variables.

5. **Create the tables, seed content, and create your admin account** from your machine:

   ```bash
   vercel env pull .env.local     # downloads DATABASE_URL and BLOB_READ_WRITE_TOKEN
   npm run db:migrate
   npm run db:seed
   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a-long-unique-password' npm run admin:create
   ```

   Passing the credentials inline keeps the password out of files. The script stores only a scrypt hash.

6. **Deploy**: push to your Git repository (or `vercel --prod`). Sign in at `https://your-domain.com/admin`.

Run `npm run db:migrate` again whenever new migrations are added to `drizzle/`.

### Any other Node.js host

Use any Postgres database for `DATABASE_URL`. File uploads use Vercel Blob; on another host you need a Blob token from a Vercel project, or replace `put()` in `src/app/api/admin/upload/route.ts` with your storage provider.

```bash
npm ci && npm run db:migrate && npm run build
NODE_ENV=production npm run start
```

## Security model

- **No default account.** The only way to create an admin is `npm run admin:create`, which reads credentials from the environment and stores a salted **scrypt** hash. Re-running it resets the password and signs out existing sessions.
- **Sessions** are random 256-bit tokens in an `httpOnly`, `SameSite=Lax`, `Secure` (`__Host-` prefixed in production) cookie. Only a SHA-256 hash of the token is stored in the `sessions` table, with a 7-day sliding expiry. Logout deletes the session server-side.
- **Authorization on the server.** `src/proxy.ts` only redirects visitors without a cookie. Every admin page calls `requireAdmin()`, and every Server Action and the upload route call `authorizeAdminRequest()`, which validates the session against the database before any read of private data or any write.
- **Validation.** All writes are validated with the Zod schemas in `src/lib/validation/admin.ts`. IDs and status arguments to Server Actions are validated too.
- **CSRF.** Server Actions use Next.js's built-in Origin/Host check; the upload route rejects requests whose `Origin` doesn't match the host, and the session cookie is `SameSite=Lax`.
- **Brute-force protection.** Five failed sign-ins per IP or per email within 15 minutes locks further attempts for that window (stored in the database, so it works across serverless instances). Error messages don't reveal whether an email exists.
- **Uploads** are checked by size and by the file's actual leading bytes (not the browser-supplied type): JPEG/PNG/WebP/AVIF images up to 5 MB, PNG/ICO/WebP favicons up to 1 MB, PDF up to 10 MB. SVG is not accepted.
- **Markdown** is rendered without raw HTML and passed through `rehype-sanitize`.
- **Drafts are never public.** Public queries filter on `status = 'published'` and a publication date in the past; drafts and scheduled posts return 404 and are excluded from the sitemap.

## Editing content

Use the admin dashboard. The seed script copies the original content from `src/data/` (`site.ts`, `experience.ts`, `projects.ts`, `skills.ts`) into the database once; after that, the database is the source of truth and edits in `src/data/` have no effect (except as the fallback when no database is configured).

Still code-managed: the **Education** timeline (`src/data/education.ts`), the three **What I do** cards (`src/data/focus-areas.ts`), the hero headline and stats, and the About section's "My journey" and "How I approach quality" cards (`src/components/sections/About.tsx`).

Design tokens (colors, radii, shadows, animations) are defined in `src/app/globals.css` under `@theme`.

## Contact form / SMTP setup

Until SMTP is configured, the form validates input but the API responds with **503** and the visitor sees a clear "not configured yet" message with a direct email link. A success message is shown only when the SMTP server accepts the email.

### Gmail (simplest option)

1. Enable 2-Step Verification on the Google account.
2. Create an App Password at <https://myaccount.google.com/apppasswords>.
3. Set:

   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_USER=alamin.6534@gmail.com
   SMTP_PASS=your-16-character-app-password
   SMTP_FROM="Portfolio Contact <alamin.6534@gmail.com>"
   CONTACT_EMAIL=alamin.6534@gmail.com
   ```

### Other providers

Any SMTP provider works (Zoho, Outlook, Brevo, Resend SMTP, Amazon SES, Mailgun). Use the host, port, and credentials your provider gives you, and set `SMTP_FROM` to a verified sender address. Replies go straight to the visitor because the email sets `Reply-To` to their address.

### Anti-spam

- Hidden honeypot field (`website`)
- Rejects submissions completed in under 3 seconds
- Rejects messages with more than 3 links
- Rate limit of 5 messages per IP per 10 minutes (in-memory, per server instance — for stronger protection on serverless hosting, add a shared store or a CAPTCHA)

## Assets

- Original CV, profile photo, and project screenshots live in `public/` and are referenced by the seeded content. New files uploaded in the admin are stored in Vercel Blob.
- **S T Amar Bari Resort** (`stamarbari.com`) has no screenshot, so its card shows a labelled illustration. Upload one from **Admin → Projects** to replace it.

## Known limitations

- Uploaded files live in a **public** Blob store. URLs are unguessable, but an image attached to a draft post is technically reachable by anyone who has its exact URL. Replaced or removed files are not deleted from Blob automatically.
- Login rate limiting is per IP and per email; there is no CAPTCHA or two-factor authentication.
- Public pages are statically generated and refreshed immediately after each admin change; a post scheduled for a future date appears within an hour of that date (the revalidation interval).
- The contact form's rate limit is per server instance.
- These changes follow SEO best practices, but no specific search ranking can be guaranteed. Submit `https://your-domain.com/sitemap.xml` in Google Search Console after deploying.

## Project structure

```
drizzle/                     # SQL migrations (generated by drizzle-kit)
scripts/                     # migrate, seed, create-admin
src/
  proxy.ts                   # Optimistic /admin redirect (Next.js 16 "proxy", formerly middleware)
  app/
    page.tsx                 # Home page + JSON-LD
    blog/                    # /blog and /blog/[slug]
    projects/[slug]/         # Project detail pages
    admin/
      login/                 # Sign-in page
      (dashboard)/           # Protected dashboard: overview, experience, projects, skills, blog, settings
      (preview)/             # Full-page blog post preview (admin only)
    api/admin/upload/        # Authenticated file uploads
    api/contact/             # Contact form API
    og/                      # Default Open Graph image
    sitemap.ts, robots.ts, manifest.ts, apple-icon.tsx, not-found.tsx
  components/
    admin/                   # Dashboard UI (shell, forms, editors, dialogs, toasts)
    blog/                    # Blog cards, article view, share links
    layout/                  # Navbar, Footer, SiteShell
    sections/                # Home page sections
    ui/                      # Shared UI
  db/                        # Drizzle schema and client
  data/                      # Original content (seed data and fallback)
  lib/                       # auth, content queries, SEO helpers, validation, uploads, formatting
  types/                     # Shared TypeScript types
public/
  documents/  images/  icon.svg
```

# Md Al Amin Sikander — Portfolio

Personal portfolio for **Md Al Amin Sikander**: Software QA Engineer, SEO Specialist, and Management & Operations professional.

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Motion for React, Lucide icons, Zod, and Nodemailer.

## Features

- Single-page portfolio: Hero, What I Do, About, Experience, Skills, Projects, Education, Contact, and Footer
- Sticky navbar that highlights the section in view, with an animated mobile menu
- Scroll progress bar, floating back-to-top button, smooth section scrolling
- Scroll-triggered reveals, staggered cards, hero parallax, and floating badges — all respecting `prefers-reduced-motion`
- Accessible skill tabs (arrow keys, Home/End) and keyboard-friendly project filters
- Project detail modal with focus trap, Escape to close, and focus restoration
- Working contact form: shared client/server Zod validation, SMTP delivery via Nodemailer, honeypot, minimum fill time, link limit, and per-instance rate limiting
- SEO: Metadata API, canonical URL, Open Graph/Twitter cards, generated OG image, `sitemap.xml`, `robots.txt`, web manifest, favicon, and `Person` JSON-LD

## Getting started

Requirements: Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local   # then edit the values
npm run dev                  # http://localhost:3000
```

Other scripts:

| Command             | Purpose                      |
| ------------------- | ---------------------------- |
| `npm run build`     | Production build             |
| `npm run start`     | Serve the production build   |
| `npm run lint`      | ESLint (Next.js rules)       |
| `npm run typecheck` | TypeScript type check        |

## Environment variables

| Variable               | Required          | Description                                                                 |
| ---------------------- | ----------------- | --------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Yes (production)  | Public URL, e.g. `https://alaminsikander.com`. Used for canonical, OG, sitemap. |
| `SMTP_HOST`            | For contact form  | SMTP server host                                                            |
| `SMTP_PORT`            | For contact form  | `465` (SSL) or `587` (STARTTLS)                                             |
| `SMTP_USER`            | For contact form  | SMTP username                                                               |
| `SMTP_PASS`            | For contact form  | SMTP password or app password                                               |
| `SMTP_FROM`            | Recommended       | Sender, e.g. `"Portfolio Contact <you@gmail.com>"`. Defaults to `SMTP_USER`. |
| `CONTACT_EMAIL`        | Optional          | Recipient. Defaults to `alamin.6534@gmail.com`.                             |

SMTP variables are read only on the server (`src/lib/mailer.ts`) and are never sent to the browser. Never commit `.env.local`.

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

Any SMTP provider works (Zoho, Outlook, Brevo, Resend SMTP, Amazon SES, Mailgun). Use the host, port, and credentials your provider gives you, and set `SMTP_FROM` to a verified sender address.

Replies go straight to the visitor because the email sets `Reply-To` to their address.

### Anti-spam

- Hidden honeypot field (`website`)
- Rejects submissions completed in under 3 seconds
- Rejects messages with more than 3 links
- Rate limit of 5 messages per IP per 10 minutes (in-memory, per server instance — for stronger protection on serverless hosting, add a shared store or a CAPTCHA)

## Editing content

All content lives in `src/data/`:

| File               | Content                                         |
| ------------------ | ----------------------------------------------- |
| `site.ts`          | Name, contact details, SEO text, navigation     |
| `focus-areas.ts`   | The three "What I do" cards                     |
| `experience.ts`    | Work history                                    |
| `skills.ts`        | Skill categories and soft skills                |
| `projects.ts`      | Projects, categories, descriptions, screenshots |
| `education.ts`     | Education timeline                              |

Design tokens (colors, radii, shadows, animations) are defined in `src/app/globals.css` under `@theme`.

## Assets

- CV: `public/documents/Md-Al-Amin-Sikander-CV.pdf` (linked by the "Download CV" button). Replace the file with the same name to update it.
- Profile photo: `public/images/al-amin-sikander.webp`
- Project screenshots: `public/images/projects/*.webp` — homepage captures of each live site. **S T Amar Bari Resort** (`stamarbari.com`) could not be reached when the screenshots were taken, so its card shows a labelled illustration. To add a real screenshot, save it as `public/images/projects/st-amar-bari.webp` and add `screenshot: "/images/projects/st-amar-bari.webp"` to that project in `src/data/projects.ts`.

## Deployment

### Vercel (recommended)

1. Push the project to a Git repository and import it at <https://vercel.com/new>.
2. In **Project → Settings → Environment Variables**, add `NEXT_PUBLIC_SITE_URL` and the SMTP variables.
3. Deploy. Redeploy after changing environment variables.
4. Add your custom domain and update `NEXT_PUBLIC_SITE_URL` to match.

### Any Node.js host

```bash
npm ci
npm run build
NODE_ENV=production npm run start   # listens on port 3000 (use -p to change)
```

Set the same environment variables on the host. The contact route needs the Node.js runtime (not static export).

## Project structure

```
src/
  app/
    api/contact/route.ts   # Contact form API (Node.js runtime)
    layout.tsx             # Fonts, metadata, skip link, motion config
    page.tsx               # Page composition + JSON-LD
    globals.css            # Tailwind theme tokens and base styles
    sitemap.ts, robots.ts, manifest.ts, icon.svg, apple-icon.tsx, opengraph-image.tsx
  components/
    layout/                # Navbar, Footer
    sections/              # Hero, Overview, About, Experience, Skills, Projects, Education, Contact
    ui/                    # Button, SectionHeading, Reveal, ProjectCard, ProjectModal, ScrollProgress, BackToTop, ...
  data/                    # Centralized content
  lib/                     # validation (Zod), mailer (Nodemailer), helpers
  types/                   # Shared TypeScript types
public/
  documents/  images/
```

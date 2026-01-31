# NeoPress — New‑Gen Anime & Gaming Blog Platform

NeoPress is a cyber‑future, dark‑mode blogging platform for Anime + Gaming news, reviews, and guides. It includes a public‑facing site with a bento grid feed and a secure, custom Admin CMS for authoring and publishing posts.

> **Learning project:** NeoPress is built for educational and experimentation purposes.

## Documentation

NeoPress is a futuristic anime + gaming media platform that combines a public-facing editorial experience with a custom admin CMS.

### Key experience highlights
- **Hero carousel:** Featured drops with tags, authors, and dates.
- **Bento grid feed:** Dynamic card layout to spotlight stories.
- **Article experience:** Read-time indicator, rich-text body, author card, and related articles.
- **Admin CMS:** Login gate, dashboard, and a rich editor with formatting tools and media uploads.

### Architecture overview
- **Frontend:** React + Vite + Tailwind CSS.
- **Content source:** Seed posts in `src/data/mockPosts.js` plus local posts in `localStorage`.
- **State helpers:** Local auth and storage utilities in `src/utils`.
- **Optional backend:** Supabase integration via `src/lib/supabaseClient.js`.

## Hosting on Replit

1. Create a new Replit project and import this GitHub repository.
2. In **Shell**, install dependencies:
   ```bash
   npm install
   ```
3. Set the run command to:
   ```bash
   npm run dev -- --host 0.0.0.0 --port 3000
   ```
4. Ensure Replit exposes port **3000** (the Vite dev server).
5. (Optional) Add Supabase secrets in **Secrets**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Open the public Replit URL to view the site.

## Highlights

- **Neo‑Tokyo visual system**: dark UI, neon purple/blue accents, glassmorphism, and bold headings.
- **Public frontend**: hero carousel, ad placeholders, bento grid feed, article pages, and legal pages.
- **Custom Admin CMS**: login gate, dashboard, and a rich‑text editor that supports headings, bold/italic, links, and image embeds.
- **Local‑first publishing**: posts are persisted in `localStorage` for instant updates.
- **Optional Supabase sync**: auto‑syncs to Supabase when credentials are provided.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run the app

```bash
npm run dev
```

Then open the local URL printed by Vite.

## Project Structure

```
src/
  components/        # Shared UI components
  data/              # Seed data for hero + posts
  lib/               # Integrations (Supabase client)
  pages/             # Route pages
  utils/             # Local storage + auth helpers
```

## Admin CMS

- **Route:** `/admin`
- **Demo credentials:**
  - Email: `admin@neopress.io`
  - Password: `NeoTokyo2024!`

From the dashboard you can create, edit, and delete posts. Publishing instantly updates the homepage.

### Rich‑text editor features

- H1 / H2 headings
- Bold / Italic
- Links
- Cover image uploads
- Image embeds inside the body

## Supabase (Optional)

If you want remote storage, set the following in a `.env` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

When present, publishes will `upsert` to a `posts` table.

**Suggested schema** (minimum viable):

```sql
create table posts (
  id text primary key,
  title text not null,
  content text not null,
  image_url text,
  date text,
  author text
);
```

## Future Enhancements (Suggestions)

- **Real authentication**: replace hardcoded credentials with Supabase Auth or another provider.
- **Rich text editor upgrade**: integrate TipTap or Lexical for more robust editing.
- **Draft workflow**: add status (draft/published), scheduled publishing, and autosave.
- **Tags & categories**: build dedicated taxonomy pages and filtering.
- **Comments + community**: add live comments via Supabase or a third‑party service.
- **Performance**: image optimization and CDN support for media uploads.
- **Analytics**: integrate privacy‑friendly analytics to measure content performance.
- **Ads integration**: wire the ad placeholders to a real ad server.

## License

This project is provided as‑is for demonstration and customization.

# an absolute website from nowhere to no one

Live at **https://my-absolute-website.vercel.app/**

Every push to `main` on GitHub deploys automatically through Vercel (about a minute).

## How to update the site

1. Make your change (see below).
2. Double-click **`publish.bat`**, type a short description, and press Enter.
3. Wait about a minute, then refresh the live site.

### Add art
Drop an image (`.jpg`, `.png`, `.webp`, `.gif`) into `public/art/`.
The file name becomes the title, so `i-declare-suffering.jpg` shows as "i declare suffering".

### Add a poem or story
1. Write it in Google Docs.
2. **File → Download → Web page (.html, zipped)**, then unzip it.
3. Rename the `.html` file to the title you want, e.g. `SomedayIllLoveMyself.html` or `A-memoir-of-an-unimportant-person.html`.
   (CapitalLetters and dashes both become spaces in the title.)
4. Put it in `src/content/poems/` or `src/content/stories/`.

**Control the order:** add a line like this at the very top of the file (newest is listed first):
```
pubDate: 2026-10-19
```
Without it, the date is whenever Vercel built the site, so the order can shuffle.

To keep your Google Docs fonts and sizes instead of the site's style, add `OVERRIDE_STYLE: TRUE` near the top.

### Add a video
Double-click **`add-video.bat`** and paste the YouTube link.

### Change the site title or description
Edit `src/consts.ts`.

## Previewing before publishing (optional)
Install Node.js LTS from https://nodejs.org, then in this folder run:
```
npm install
npm run dev
```
and open http://localhost:4321.

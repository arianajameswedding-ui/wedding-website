# Ariana & James Wedding Website

**June 5, 2027 · Villa del Balbianello · Lake Como, Italy**

---

## Project Structure

```
wedding-site/
├── index.html          ← Single entry point; shell with nav + footer
├── css/
│   └── styles.css      ← All shared styles (variables, nav, typography, footer)
├── js/
│   └── router.js       ← Hash-based SPA router + page init logic
├── pages/
│   ├── home.html       ← Hero image, welcome copy, countdown, details
│   ├── schedule.html   ← Weekend timeline (Fri–Sun)
│   ├── travel.html     ← Flights, hotels, getting around
│   ├── registry.html   ← Gift registries
│   ├── story.html      ← Timeline of the relationship
│   ├── todo.html       ← Things to do around Lake Como
│   └── faqs.html       ← Accordion FAQ
├── assets/
│   └── hero.jpg        ← Lake Como proposal photo (replace with final image)
└── README.md           ← This file
```

---

## Routing

The site uses **hash-based routing** — no server configuration needed.

| URL              | Page          |
|------------------|---------------|
| `/`              | Home          |
| `/#/schedule`    | Schedule      |
| `/#/travel`      | Travel        |
| `/#/registry`    | Registry      |
| `/#/story`       | Our Story     |
| `/#/todo`        | Things to Do  |
| `/#/faqs`        | FAQs          |

Links are shareable and work with browser back/forward navigation.

---

## Running Locally

Because pages are loaded via `fetch()`, you need a local web server (not just opening the HTML file directly).

**Option 1 — Python (built-in):**
```bash
cd wedding-site
python3 -m http.server 8000
# Open http://localhost:8000
```

**Option 2 — Node.js (npx):**
```bash
cd wedding-site
npx serve .
# Open the URL shown in your terminal
```

**Option 3 — VS Code:**
Install the **Live Server** extension, right-click `index.html` → "Open with Live Server".

---

## Deploying

### Netlify (recommended — free)
1. Go to [netlify.com](https://netlify.com) and sign up
2. Drag the `wedding-site/` folder onto the Netlify dashboard
3. Your site is live instantly at a `*.netlify.app` URL
4. Add a custom domain (e.g. `arianajames2027.com`) under Site Settings → Domain Management

### GitHub Pages
1. Push the `wedding-site/` folder to a GitHub repo
2. Go to Settings → Pages → Source: `main` branch, `/ (root)` folder
3. Your site will be at `https://yourusername.github.io/repo-name/`

### Vercel
```bash
npm i -g vercel
cd wedding-site
vercel
```

---

## Customizing

### Replacing the hero image
Drop your final photo at `assets/hero.jpg` (or update the `src` in `pages/home.html`).

### Updating content
Each page is a standalone HTML partial in `pages/`. Open any file and edit the content directly — no build step required.

### Adding a new page
1. Create `pages/newpage.html`
2. Add an entry to the `ROUTES` object in `js/router.js`
3. Add a `<li>` to the nav in `index.html` (desktop + mobile menus)

### Changing fonts or colors
All CSS variables (colors, fonts) are defined at the top of `css/styles.css` under `:root { }`.

---

## Technical Notes

- **No framework, no build tool** — plain HTML, CSS, and vanilla JS
- Pages are fetched and cached in memory after first load (instant on repeat visits)
- The router listens to `hashchange` events and supports browser history natively
- The countdown timer auto-starts on the home page and clears itself on navigation
- FAQ accordions use event delegation — no inline `onclick` handlers needed

---

*Made with love for Ariana & James.*

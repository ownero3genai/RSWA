# RSWA — Realtors Social Welfare Association

Official website for the **Realtors Social Welfare Association (RSWA)**, Maharashtra's most trusted realtor network. ISO 9001 certified, empowering real estate professionals since 2010.

🌐 **Live Site:** [rswa-website.web.app](https://rswa-website.web.app)

---

## Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Hero slider, stats, about, board members, gallery, CTA |
| About | `about.html` | History, core values, leadership, timeline |
| Media | `media.html` | Photo gallery with category filters and lightbox |
| Membership | `membership.html` | Member directory with search, filters, and profile modals |
| Branch | `branch.html` | Branch committee & members with smart filtering |
| Contact | `contact.html` | Contact form, office locations, map embed |

---

## Tech Stack

- **Pure HTML5 / CSS3 / Vanilla JS** — no frameworks, no build tools
- **Firebase Hosting** — static site deployment
- **Font Awesome 6.5.0** — icons via CDN
- **Google Fonts** — Montserrat + Open Sans

## Brand

| Token | Value |
|-------|-------|
| Primary Orange | `#E87722` |
| Navy | `#1A1A2E` |
| White | `#FFFFFF` |
| Light Grey | `#F5F5F5` |

---

## Project Structure

```
RSWA/
├── index.html          # Homepage
├── about.html          # About page
├── media.html          # Gallery page
├── membership.html     # Member directory
├── branch.html         # Branch committee
├── contact.html        # Contact page
├── css/
│   └── style.css       # Master stylesheet (CSS variables, all components)
├── js/
│   └── main.js         # Navbar, hero slider, counters, gallery, lightbox
└── asset/
    ├── RSWA-logo.png   # Official RSWA logo
    ├── hero1.webp      # Hero slider image 1
    ├── hero2.webp      # Hero slider image 2
    └── hero3.webp      # Hero slider image 3
```

---

## Deployment

Hosted on **Firebase Hosting** under project `rswa-website`.

```bash
firebase deploy --only hosting --project rswa-website
```

---

## License

MIT © 2026 RSWA — Realtors Social Welfare Association

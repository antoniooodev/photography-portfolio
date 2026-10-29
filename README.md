# Photography portfolio

A static portfolio site for a photographer, built with plain HTML, CSS and JavaScript. There is nothing to install and no build step.

## Pages

| Page | File | Description |
|---|---|---|
| Home | `index.html` | The photographer's name set very large and split across lines, with two pill buttons on the sides. Hovering a button pulls the name apart and brings in three photos from that category, going from blurred to sharp. The links at the bottom swap their label on hover (INFO → CONTACT). |
| Work | `work.html?c=people` (without `?c=` it shows every photo) | An airy four-column grid with the navigation fixed at the bottom. Clicking a photo enlarges it in place and shows a link to its project. The **S M L** switch in the top right changes the grid density. |
| Projects | `projects.html` | Four-column grid of project covers with title and "View project". Covers are black and white and turn to colour on hover. |
| Project | `project.html?p=faces` | Full-screen opening photo with the title, description and credits, then the remaining photos (landscape images full width, portrait images in pairs), a lightbox with keyboard and swipe support, and a link to the next project. |
| Info | `info.html` | Split layout: the portrait stays fixed on the left while the text column scrolls, slowly zooming out. The name is revealed line by line, with an availability status and the live local time. The bio lights up word by word as you scroll, section rules draw in when they enter the viewport, the email has a copy button, and clients scroll by in an endless strip that pauses on hover. Everything stacks into one column on phones and stays static when the visitor prefers reduced motion. |

On small screens, and on phones held sideways, the bottom navigation collapses into a single MENU button. The top bar hides while scrolling down so it never sits on top of the content, and comes back when scrolling up. Every page ends with a small credit line, set in `js/data.js`.

## Editing the content

All texts, categories and projects live in **`js/data.js`**: name, email, phone, Instagram, the bio, availability and local time zone, clients, agency and the list of projects.

To add a project:

1. create the folder `images/<project-slug>/` and put the photos in it (JPGs around 2000px on the long side work well);
2. add an entry to the `projects` array in `js/data.js`, giving the proportions (`w`, `h`) of each photo. The first photo is the cover and the full-screen image of the project page.

The photos currently in `images/` are **demo images from Unsplash** (Unsplash License), listed with their authors in [`CREDITS.md`](CREDITS.md). They are only there to show the site complete and must be replaced with the photographer's own work before publishing. The categories (People, Landscape, City, Still Life), project titles and descriptions are placeholders too.

## Styling

Colours, fonts and spacing are CSS custom properties at the top of `css/style.css` (`--ivory`, `--ink`, `--font-display`, `--airy`, …). Fonts are loaded from Google Fonts:

- **Italiana** for display type;
- **Geist** for body text;
- **Geist Mono** for small labels.

## Running locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. The site can be deployed as is to GitHub Pages, Netlify or Vercel.

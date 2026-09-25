# dsal3389.xyz

A minimal personal site built with Astro and Tailwind CSS. Black, red, monospace type, and a field of animated ASCII waves. Click or tap the background to send a reactive ripple through the waves, then scroll down to browse all posts.

## Development

```sh
npm install
npm run dev
```

Open the URL printed by Astro.

```sh
npm run check   # Astro and TypeScript diagnostics
npm run build   # Validate and generate the static site in dist/
npm run preview
```

## Design

- A full-screen introduction followed by a wrapping flex layout of all published posts, newest first: two columns on wider screens and one at 800px or below. Cards in each row share a height, with dates above the content and tags aligned at the bottom. Source Code Pro is bundled and served locally, with its license in `public/fonts/source-code-pro-LICENSE.md`.
- Black `#08090b`, red `#f03535`, off-white type, and three red ASCII layers fixed behind the homepage as it scrolls. Post cards sit over the waves with native CSS double borders, dotted date dividers, and terminal-style typography.
- A fixed top-right icon button opens a dropdown of color swatches for the original black/red palette and eggshell `#f7f3e8` with Google blue `#4285f4` accents (darker blue for readable text). The choice persists across pages and visits, with matching waves, cards, scrollbars, and syntax highlighting. The picker supports keyboard navigation and closes on selection, Escape, or interaction outside it.
- Daniel Sonbolian's introduction is vertically centered over the waves, with a typewriter subtitle cycling through "developer", "car enthusiast", and "I use arch BTW". The subtitle is static without JavaScript or when reduced motion is enabled.
- Irregular waves flow continuously, starting at a random point in the original animation on each page load. Clicks and taps create overlapping wavefronts that spread from the point of contact and fade over 2.4 seconds.
- Reduced-motion preferences produce a static scene and disable smooth scrolling. Hidden tabs pause wave rendering.
- Server-rendered desktop and portrait scenes remain visible without JavaScript.
- The decorative art is hidden from assistive technology; content and controls remain keyboard accessible.

Edit copy in `src/pages/index.astro` and styling through Tailwind utility classes in the Astro components and pages. `src/styles/global.css` defines the shared theme, responsive variants, font, focus defaults, and browser scrollbar styling. The wave field lives in `src/lib/waves.ts`, with interaction in `src/components/AsciiWaves.astro`.

Add posts as Markdown files in `src/content/blog/` with `title`, `description`, and `date` frontmatter, plus optional `tags` and `draft`. Published posts automatically appear in the homepage list and get a page at `/blog/<filename>/`. Set `draft: true` to exclude a post from both the list and generated pages.

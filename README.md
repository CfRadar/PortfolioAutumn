# Anurag Yadav | Autumn Portfolio

Pixel-art autumn portfolio built with Vite, React 18 and TypeScript.

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build
```

## Where to edit
- `src/data.ts`: projects, skills, experience, certificates, links, welcome message
- `src/styles.css`: all styling and colour variables (`:root`)
- `src/scene.ts`: animated hero canvas
- `src/sprites.ts`: pixel sprites (player, fire, hearts)
- `src/components/`: one component per section

Deploys as a static site (Vercel, Netlify, GitHub Pages): build command `npm run build`, output `dist`.

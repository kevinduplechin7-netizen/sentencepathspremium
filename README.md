# SentencePathsLite — deploy wrapper

This repo is a **static deploy wrapper** around a pre-built SentencePathsLite site.

This wrapper exists so your “extract + run” workflow can start the app with `npm run dev`, and so Netlify can build/publish a `dist/` folder.

## Local dev

### PowerShell

Run:

```powershell
./RUN_DEV.ps1
```

Or manually:

```powershell
npm install
npm run dev
```

Then open the printed localhost URL.

## Netlify

- Build command: `npm run build`
- Publish directory: `dist`

The build step copies `site/` into `dist/`.

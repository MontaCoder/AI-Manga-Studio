# AIMangaStudio

<img src="./og.webp" alt="og image" width="360" />

AI-assisted manga creation studio — generate scripts, design characters, compose storyboards, and export pages with ease.

## Table of contents

- About
- Features
- Quick start
	- Requirements
	- Install
	- Local development
	- Build & preview
- Configuration
	- API keys
	- Environment variables
- Usage highlights
- Project structure
- Contributing
- Roadmap
- Troubleshooting & FAQ
- License

## About

AIMangaStudio is an end-to-end tool for manga creators and studios. It combines natural-language script generation, AI-driven storyboard layout, and character style management to speed up the iteration from idea to finished pages.

The app is built with React, TypeScript, and Vite and integrates with Google GenAI services for generation tasks.

## Features

- Natural-language script generation (story, dialogue, narration)
- AI-driven storyboard and panel layout (speech bubbles, camera cuts, framing)
- Character design and style control (upload and manage character references)
- Multi-page export: PNG and PDF
- Project history, versioning, and comparisons
- Video generation/producer utilities (experimental)

## Quick start



- Node.js 18+ (recommended)
- npm or yarn

### Install

Open a terminal in the project root and run:

```bash
npm install
```

### Local development

Start the dev server:

```bash
npm run dev
```

The app should open at http://localhost:5173 by default (Vite). If you use a different port, check the terminal output.

### Build & Preview

```bash
npm run build
npm run preview
```

This produces an optimized production build and serves a local preview.

## Configuration

### API keys

AIMangaStudio integrates with GenAI services that require API keys. Place your keys in a `.env` file in the project root.

Create a `.env` file from the example (if present) or add the variables below:

```env
# Example variables — update to match your environment and provider
VITE_GENAI_API_KEY=your_api_key_here
VITE_GENAI_ENDPOINT=https://api.example.com
```

Note: Variables exposed to the browser must be prefixed with `VITE_`.

### Environment variables reference

- VITE_GENAI_API_KEY — API key for the GenAI provider
- VITE_GENAI_ENDPOINT — Optional custom endpoint for the GenAI API

Adjust additional variables as needed for third-party integrations.

## Usage highlights

- Open the app and provide an API key via the API Key modal (top-right) or `.env` file
- Use the Story input to generate scripts and dialogues
- Open the Character Uploader to add references or create new character styles
- Generate storyboards and adjust panels with the Panel Editor
- Export pages as PNG or PDF from the result view

Screenshots and examples may be found in the repository or demo branch.

## Project structure

Key files and folders:

- `index.html`, `index.tsx`, `App.tsx` — app entry points
- `components/` — React components (UI and modals)
- `contexts/`, `hooks/` — app state and reusable hooks
- `services/` — GenAI integration and API wrappers
- `i18n/locales.ts` — localization resources
- `vite.config.ts`, `tsconfig.json`, `package.json` — build and tooling config

## Contributing

Contributions are welcome. A simple workflow:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make changes and add tests where applicable
4. Run the dev server and make sure things work: `npm run dev`
5. Open a PR with a clear description of the change

Please follow the existing code style and add/update tests for new behavior. If you're changing public APIs or adding a big feature, open an issue first to discuss the design.

## Roadmap

Planned improvements and ideas:

- More art-style presets and character template library
- Export presets and print-ready layout templates
- Better multi-page continuity and panel flow analysis
- Backend for persistence, multi-user projects, and asset management

If you'd like to contribute to the roadmap, please open an issue and tag it `roadmap`.

## Troubleshooting & FAQ

- Q: The app shows "missing API key" — where do I add it?
	- A: Open the API Key modal in the app (top-right) or add `VITE_GENAI_API_KEY` to your `.env` and restart the dev server.

- Q: I get CORS errors when calling the GenAI endpoint.
	- A: Ensure you're using the correct endpoint for browser calls or proxy requests through a server-side component.

- Q: Build fails with TypeScript errors.
	- A: Run `npm run dev` and fix the reported type errors. If unsure, paste the terminal output in an issue.

## License

This project is released under the Apache License 2.0. See the `LICENSE` file for details.
 
---

© 2025 Montassar Hajri







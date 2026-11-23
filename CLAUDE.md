# Wire Gauge Calculator (wires)
- Static React/Vite web app that sizes copper wire and fuses for 12V/24V RV, camper and off-road DC circuits. Deployed to GitHub Pages at `/wires/` and linked from overlandn.com.

## Commands
- Install: `npm ci` (unverified here: network was off)
- Dev: `npm run dev` (Vite; app is served under `/wires/`, e.g. http://localhost:5173/wires/)
- Test all: `npm test` (= `node --test tests/*.test.js`; needs no install, no dependencies)
- Single test: `node --test --test-name-pattern="winch" tests/wireCalculator.test.js`
- Build: `npm run build` (output in `dist/`; unverified here, needs `npm ci`)
- Docker: `make dev` / `make build` / `make run` (unverified; see Gotchas)
- No linter, formatter or typechecker is configured. Don't invent commands for them.

## Architecture
- `src/engine/wireData.js`: AWG table (resistance, ampacity at 60/75/90C), derating tables, fuse sizes, use-case presets. Data only.
- `src/engine/wireCalculator.js`: pure functions, no React. `calculateWireSpecification(input)` is the single entry point and returns `{input, recommendation, fuse, alternatives, guidance}`.
- `src/components/WireCalculatorForm.jsx`: form state, presets. `WireResultsDisplay.jsx` plus `src/components/results/*`: one card per result section.
- `src/App.jsx`: wires form to engine, shows errors thrown by the engine; footer has the Support button.
- `src/appConfig.js` + `src/utils/supportUrl.js`: Support button URL, from build-time `SUPPORT_URL`.
- Data flow: form values -> `calculateWireSpecification` (coerces/validates, converts to feet) -> `recommendWireGauge` picks smallest wire passing voltage drop, load ratio AND fuse fit -> `recommendFuseSize` -> result cards.

## Conventions
- Calculation logic stays in `src/engine/` as pure functions; components only render.
- Plain CSS with variables from `src/styles/global.css`; one `.css` file per component. No CSS framework.
- Every engine behaviour change needs a test in `tests/wireCalculator.test.js` (Node's built-in `node:test` + `assert`; no Jest/Vitest).
- ES modules everywhere (`"type": "module"`); engine imports need the `.js` extension.
- Work on a branch and open a PR to `main`; PR #1 is the pattern. Merging to `main` deploys.

## Gotchas
- Safety-relevant tool: wrong numbers can cause undersized wire or fuses. Check any data/derating change against NEC Table 310.16 and ABYC E-11 (fuse within 7" of the battery, not 18").
- Form `<select>`/range values arrive as strings; the engine coerces with `Number()`. Keep that when adding fields.
- A wire is only recommended if a standard fuse exists for it at that load. Don't remove that check; it is why "no standard fuse" dead ends were fixed.
- Winch preset uses `loadDuty: 'intermittent'` (full ampacity, 1.0x fuse). Continuous loads use 0.8x ampacity and 1.25x fuse.
- Resistance values are ~20C, not 75C (comment in `wireData.js` says so). Using hot values would make results more conservative.
- Support button: `SUPPORT_URL` is injected by `define` in `vite.config.js` at build time (CI: repo secret or variable `SUPPORT_URL`; Docker: build arg). Unset/invalid -> disabled "Coming soon" button. Never commit the URL.
- `vite.config.js` sets `base: '/wires/'`; asset paths break if it changes.
- Docs conflict: `DOCKER.md`/`README.md` say dev is at localhost:3000, but nothing sets Vite's port (default 5173) so `make dev` is probably wrong (unverified).
- `PROJECT_SUMMARY.md` and `DOCKER_SETUP_SUMMARY.md` are stale generated summaries (they reference a nonexistent `deploy-overlandn.sh`). Don't trust them.
- README and `wireData.js` header still cite NEC "310.15(B)(16)"; the current table is 310.16.
- `package-lock.json` is committed and CI uses `npm ci`; keep it in sync with `package.json`.

## Definition of done
- `npm test` passes with a new or updated test for the change.
- `npm run build` succeeds (when dependencies can be installed).
- For UI changes, load the app and check the form and results screen with the winch and LED presets.
- No real URLs or secrets committed; changes go through a PR, not directly to `main`.

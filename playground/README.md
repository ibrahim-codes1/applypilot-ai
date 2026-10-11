# AccessLab — FlyRank React Accessibility Playground

A self-contained **React + TypeScript** accessibility drill for FlyRank Frontend AI Engineering. Place this **`playground/` folder at the root of your existing `applypilot-ai` GitHub repository**; it is a standalone practice app, not a new page in the deployed capstone.

## What's inside

- Three **hand-built** interactive components using plain React + TypeScript and no component UI library:
  - Modal dialog with keyboard trap, Escape, inert page background, focus return.
  - Horizontal tabs with roving focus, Left/Right, Home/End, `aria-selected`.
  - Disclosure with native Enter/Space, `aria-expanded`, `aria-controls`.
- Separate **Radix/shadcn-style comparison** components with their source in `src/components/ui/`.
- `NOTES.md` describing at least two concrete accessibility/API gaps with manual review checklist.
- Playwright keyboard behavior tests and mobile width check.
- `components.json` and Tailwind config ready for the **official shadcn CLI** source-generation step.

## Important — complete the official shadcn requirement

The archive contains **authored shadcn-style wrappers**, not a claim that the shadcn CLI was run. The assignment asks you to install shadcn and inspect its *generated* dialog and tabs. After `npm install`, run:

```bash
npx shadcn@latest add dialog tabs --overwrite --yes
```

The `--overwrite` flag intentionally replaces the included reference adapters with the actual source generated on *your machine*. Review the diffs and update `NOTES.md` with anything new you learn. Then build and test again. Do not commit the CLI operation's result as complete until you have done it.

## Run locally (normal setup)

Requirements: Node.js 20.19+ / 22.12+ or a newer compatible Node version; npm; internet access to install dependencies.

```bash
cd playground
npm install
npm run build
npm run dev
```

Visit `http://localhost:5173`.

## Run on your existing Windows D: drive Node install

Because your current machine runs Node from `D:\Node`, and npm's script was previously found at `D:\node_modules\npm\bin\npm-cli.js`, use PowerShell:

```powershell
cd C:\Users\Ibrahim\Projects\ApplyPilot-AI\playground
$env:Path = "D:\Node;$env:Path"
node "D:\node_modules\npm\bin\npm-cli.js" install
node "D:\node_modules\npm\bin\npm-cli.js" run build
node "D:\node_modules\npm\bin\npm-cli.js" run dev
```

To run the official shadcn CLI using npm's confirmed direct entry point:

```powershell
node "D:\node_modules\npm\bin\npm-cli.js" exec --yes --package=shadcn@latest -- shadcn add dialog tabs --overwrite --yes
```

If the CLI prompts for a directory, select this `playground` app, not your `next-app` capstone. If it reports a registry/network error, keep the adapters unchanged and retry once network access works.

## Test

```bash
npx playwright install chromium
npm run test:e2e
```

The tests exercise focus trap, focus return, inert background, tabs roving keys, disclosure Enter/Space, and 375px/1280px overflow. Run them after generating official shadcn source as well.

## Files

```text
playground/
├── README.md
├── NOTES.md
├── components.json
├── package.json
├── index.html
├── playwright.config.ts
├── tsconfig.json
├── vite.config.ts
├── public/favicon.svg
├── src/
│   ├── App.tsx
│   ├── styles.css
│   ├── main.tsx
│   ├── components/
│   │   ├── handbuilt/ModalDialog.tsx
│   │   ├── handbuilt/AccessibleTabs.tsx
│   │   ├── handbuilt/Disclosure.tsx
│   │   ├── ui/dialog.tsx              # preliminary Radix wrappers; replaced by CLI
│   │   └── ui/tabs.tsx                # preliminary Radix wrappers; replaced by CLI
│   └── lib/utils.ts
└── tests/keyboard.spec.ts
```

## Submit to FlyRank

Submit the GitHub repository (branch or main) **after verifying the tests and updating `NOTES.md`**. The portal Q&A says the repository link is sufficient. Include the `playground/` directory in the existing repository; `next-app/` remains untouched.

**Status on creation:** Source written and static syntax inspection attempted; full `npm install`, shadcn CLI generation, typecheck and browser tests **must be completed on a machine with npm registry access**. Do not say these were completed unless you run them successfully.

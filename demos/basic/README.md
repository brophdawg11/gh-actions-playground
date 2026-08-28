# Basic router demo

A small Vite app showing `@gh-actions-playground/router` with Remix UI 3. It
includes static routes for the home, projects, and about pages; a dynamic
`/projects/:projectId` route; and a `/*` wildcard fallback.

Install dependencies and start the demo from the repository root:

```sh
pnpm install
pnpm dev
```

The filtered workspace command is equivalent:

```sh
pnpm --filter @gh-actions-playground/basic-demo dev
```

Vite serves the app at `http://localhost:5173` by default.

Build and type-check the demo with:

```sh
pnpm --filter @gh-actions-playground/basic-demo build
pnpm --filter @gh-actions-playground/basic-demo typecheck
```

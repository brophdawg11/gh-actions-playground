# Router

A small client-side router for Remix UI 3. It maps pathname patterns to Remix
UI components, compiles those patterns to native `URLPattern` instances, and
uses the Navigation API to update the rendered component as the URL changes.

## Usage

Install the monorepo dependencies from the repository root:

```sh
pnpm install
```

The demo consumes this package through the pnpm workspace using
`@gh-actions-playground/router`:

```tsx
import { createRoot, type Handle } from "@remix-run/ui";
import { Router, type RouteProps } from "@gh-actions-playground/router";

function Home() {
  return () => <h1>Home</h1>;
}

function Project(handle: Handle<RouteProps>) {
  return () => <h1>Project {handle.props.params.projectId}</h1>;
}

function NotFound() {
  return () => <h1>Not found</h1>;
}

let root = createRoot(document.querySelector("#app")!);
root.render(
  <Router
    routes={{
      "/": Home,
      "/projects/:projectId": Project,
      "/*": NotFound,
    }}
  />,
);
```

Routes are checked in declaration order, and the first match is rendered. Route
keys use native [`URLPattern`](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern)
pathname syntax, including named segments such as `:projectId` and wildcards.
Matched pathname groups are available to route components through
`handle.props.params`.

The router uses the
[Navigation API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API)
to intercept same-origin, non-download navigations. Cross-origin, hash-only,
and non-interceptable navigations remain under browser control. The target
browser must support both APIs.

## Tests

The tests run in headless Chromium using Vitest browser mode. Install the
browser once, then run the router tests from the repository root:

```sh
pnpm test:install-browser
pnpm --filter @gh-actions-playground/router test
```

Run the package type-check with:

```sh
pnpm --filter @gh-actions-playground/router typecheck
```

import { createRoot, on, type Handle } from "@remix-run/ui";
import button from "@remix-run/ui/button";
import {
  Router,
  type RouteProps,
  type Routes,
} from "@gh-actions-playground/router";

import "./styles.css";

let routes: Routes = {
  "/": Home,
  "/projects": Projects,
  "/projects/:projectId": Project,
  "/about": About,
  "/*": NotFound,
};

function App() {
  return () => (
    <div class="app-shell">
      <header class="site-header">
        <a class="brand" href="/" aria-label="Router demo home">
          Route Lab
        </a>
        <nav aria-label="Primary navigation">
          <a href="/">Home</a>
          <a href="/projects">Projects</a>
          <a href="/about">About</a>
        </nav>
      </header>
      <main id="main-content" tabindex={-1}>
        <Router routes={routes} />
      </main>
      <footer>
        Built with <code>@remix-run/ui</code>, <code>URLPattern</code>, and the
        Navigation API.
      </footer>
    </div>
  );
}

function Home(handle: Handle<RouteProps>) {
  let count = 0;

  return () => (
    <section class="page page-home">
      <p class="eyebrow">Tiny router, native platform</p>
      <h1>Navigation without a framework-sized router</h1>
      <p class="lede">
        This demo maps URL patterns directly to Remix UI components and lets
        the browser own navigation history.
      </p>
      <div class="actions">
        <a class="text-link" href="/projects">
          Browse projects <span aria-hidden="true">→</span>
        </a>
        <button
          mix={[
            button({ size: "lg", tone: "primary" }),
            on("click", () => {
              count += 1;
              handle.update();
            }),
          ]}
        >
          Demo count: {count}
        </button>
      </div>
    </section>
  );
}

function Projects() {
  return () => (
    <section class="page">
      <p class="eyebrow">Pattern: /projects</p>
      <h1>Projects</h1>
      <p class="lede">Choose a project to exercise a dynamic URL pattern.</p>
      <ul class="project-list">
        <li>
          <a href="/projects/alpha">
            <strong>Alpha</strong>
            <span>Component runtime experiments</span>
          </a>
        </li>
        <li>
          <a href="/projects/beacon">
            <strong>Beacon</strong>
            <span>Navigation and history checks</span>
          </a>
        </li>
      </ul>
    </section>
  );
}

function Project(handle: Handle<RouteProps>) {
  return () => {
    let projectId = handle.props.params.projectId;

    return (
      <section class="page">
        <p class="eyebrow">Pattern: /projects/:projectId</p>
        <h1>Project: {projectId}</h1>
        <p class="lede">
          This page matched a named <code>URLPattern</code> segment.
        </p>
        <a class="text-link" href="/projects">
          <span aria-hidden="true">←</span> All projects
        </a>
      </section>
    );
  };
}

function About() {
  return () => (
    <section class="page">
      <p class="eyebrow">Pattern: /about</p>
      <h1>About the demo</h1>
      <p class="lede">
        It is intentionally small enough for issue triage and agent-authored
        fix pull requests, while still having real browser behavior and tests.
      </p>
    </section>
  );
}

function NotFound() {
  return () => (
    <section class="page">
      <p class="eyebrow">Pattern: /*</p>
      <h1>Page not found</h1>
      <p class="lede">No specific route matched this URL.</p>
      <a class="text-link" href="/">
        Return home
      </a>
    </section>
  );
}

let container = document.querySelector<HTMLElement>("#app");

if (!container) {
  throw new Error("Expected an #app container");
}

let root = createRoot(container);
root.render(<App />);

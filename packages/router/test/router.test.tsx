import { render } from "@remix-run/ui/test";
import { beforeEach, describe, expect, it } from "vitest";

import { Router, type RouteComponent } from "../src/index.ts";

beforeEach(() => {
  window.history.replaceState(null, "", "/");
});

describe("Router", () => {
  it("renders the component matching the current pathname", () => {
    let view = render(
      <Router
        routes={{
          "/": Home,
          "/about": About,
        }}
      />,
    );

    expect(view.container.textContent).toBe("Home");
    view.cleanup();
  });

  it("uses URLPattern pathname syntax", () => {
    window.history.replaceState(null, "", "/projects/123");

    let view = render(
      <Router
        routes={{
          "/": Home,
          "/projects/:projectId": Project,
        }}
      />,
    );

    expect(view.container.textContent).toBe("Project");
    view.cleanup();
  });

  it("updates the rendered component for intercepted navigations", async () => {
    let view = render(
      <Router
        routes={{
          "/": Home,
          "/about": About,
        }}
      />,
    );

    await view.act(() => window.navigation.navigate("/about").finished);

    expect(window.location.pathname).toBe("/about");
    expect(view.container.textContent).toBe("About");
    view.cleanup();
  });
});

let Home: RouteComponent = () => () => <h1>Home</h1>;
let About: RouteComponent = () => () => <h1>About</h1>;
let Project: RouteComponent = () => () => <h1>Project</h1>;

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

  it("passes named pathname parameters to the route component", () => {
    window.history.replaceState(null, "", "/projects/123");

    let view = render(
      <Router
        routes={{
          "/projects/:projectId": ProjectWithParams,
        }}
      />,
    );

    expect(view.container.textContent).toBe("Project 123");
    view.cleanup();
  });

  it("updates pathname parameters after an intercepted navigation", async () => {
    window.history.replaceState(null, "", "/projects/123");

    let view = render(
      <Router
        routes={{
          "/projects/:projectId": ProjectWithParams,
        }}
      />,
    );

    await view.act(() => window.navigation.navigate("/projects/456").finished);

    expect(view.container.textContent).toBe("Project 456");
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
let ProjectWithParams: RouteComponent = (handle) => () => (
  <h1>Project {handle.props.params.projectId}</h1>
);

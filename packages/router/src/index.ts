import {
  createElement,
  type Handle,
  type RemixNode,
} from "@remix-run/ui";

export type RouteParams = Record<string, string | undefined>;

export interface RouteProps {
  params: RouteParams;
}

export type RouteComponent = (handle: Handle<RouteProps>) => () => RemixNode;
export type Routes = Record<string, RouteComponent>;

export interface RouterProps {
  routes: Routes;
}

type CompiledRoute = {
  component: RouteComponent;
  pattern: URLPattern;
};

/**
 * Renders the first route whose URLPattern matches the current URL.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/URLPattern
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API
 */
export function Router(handle: Handle<RouterProps>) {
  let currentUrl = window.location.href;
  let compiledRoutes: CompiledRoute[] = [];
  let sourceRoutes: Routes | undefined;

  window.navigation.addEventListener(
    "navigate",
    (event) => {
      let destination = new URL(event.destination.url);

      if (
        !event.canIntercept ||
        event.downloadRequest !== null ||
        event.hashChange ||
        destination.origin !== window.location.origin
      ) {
        return;
      }

      // Interception lets the browser commit its history entry while this app
      // replaces only the rendered component.
      // https://developer.mozilla.org/en-US/docs/Web/API/NavigateEvent/intercept
      event.intercept({
        async handler() {
          currentUrl = destination.href;
          await handle.update();
        },
      });
    },
    { signal: handle.signal },
  );

  return () => {
    if (sourceRoutes !== handle.props.routes) {
      sourceRoutes = handle.props.routes;
      compiledRoutes = Object.entries(sourceRoutes).map(
        ([pathname, component]) => ({
          component,
          pattern: new URLPattern({ pathname }),
        }),
      );
    }

    let match = compiledRoutes.findLast(({ pattern }) => pattern.test(currentUrl));
    if (!match) {
      return null;
    }

    let result = match.pattern.exec(currentUrl);
    return result
      ? createElement(match.component, { params: result.pathname.groups })
      : null;
  };
}

# @stencil-community/router

[![npm][npm-badge]][npm-badge-url] [![CI][ci-badge]][ci-badge-url]

A small, treeshakable router for [Stencil](https://stenciljs.com), built on [`@stencil/store`](https://github.com/stenciljs/store).

- **Lightweight & treeshakable**: features you don't use aren't included in your build.
- **Simple**: provides the bare minimum and stays out of the way.
- **No extra DOM**: the router renders no wrapper elements, so styling stays simple.
- **Static-site friendly**: optional per-page static state for prerendered apps.

The current location is held in a `@stencil/store`. Routes are declared with
functional components and `Router.Switch` renders only the first route that
matches.

## Compatibility

| `@stencil/core` | JSX mode                                                     |
| --------------- | ------------------------------------------------------------ |
| 4.x             | `jsxImportSource` (automatic runtime) and `jsxFactory` (`h`) |
| 5.x             | `jsxImportSource` (automatic runtime) and `jsxFactory` (`h`) |

The package is published as ES modules only.

## Install

```bash
npm install @stencil-community/router
```

## Usage

Create one router for your app and share it:

```ts
// src/router.ts
import { createRouter } from "@stencil-community/router";

export const Router = createRouter();
```

```tsx
import { Component, Host } from "@stencil/core";
import { Route } from "@stencil-community/router";
import { Router } from "../router";

@Component({ tag: "app-root" })
export class AppRoot {
  render() {
    return (
      <Host>
        <Router.Switch>
          <Route path="/">
            <h1>Welcome</h1>
          </Route>

          <Route path={/^\/account/}>
            <app-account></app-account>
          </Route>
        </Router.Switch>
      </Host>
    );
  }
}
```

The examples use the automatic JSX runtime, which needs this in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@stencil/core"
  }
}
```

With the classic `"jsx": "react", "jsxFactory": "h"` setup, also import `h` from
`@stencil/core` in each file.

### Matching

A route's `path` can be:

- a **string**, matched exactly against the pathname
- a **RegExp**, whose capture groups become params
- a **function** `(pathname) => params | boolean | undefined`
- the result of **`match()`**, which supports named params (`/blog/:page`)

Pathnames are lowercased before matching, so string paths should be lowercase.

### Redirects

```tsx
<Router.Switch>
  <Route path="/" to="/main" />
  <Route path={/^\/old-account/} to="/account" />
</Router.Switch>
```

### Params

Use the `render` prop to receive params. Use `render` _instead of_ JSX children.

```tsx
import { Route, match } from "@stencil-community/router";

<Router.Switch>
  <Route path={match("/blog/:page")} render={({ page }) => <blog-post page={page} />} />

  <Route path={/^\/acc(ou)nt/} render={(params) => <p>{params[1]}</p>} />

  <Route
    path={(pathname) => (pathname.includes("hello") ? { user: "hello" } : undefined)}
    render={({ user }) => <h1>User: {user}</h1>}
  />
</Router.Switch>;
```

`match(path, { exact, strict })` also accepts a RegExp or an array of paths, and
`matchAny([...paths])` matches the first of several patterns.

### Links

`href()` returns the `href` and click handler for a native `<a>`, so no extra
DOM is rendered:

```tsx
import { href } from "@stencil-community/router";

<a {...href("/blog")} class="my-link">
  Go to blog
</a>;
```

Navigate programmatically with `Router.push("/blog")`.

### Guards

Routes are plain JSX, so conditional rendering works as a guard:

```tsx
@State() loggedIn = false;

render() {
  return (
    <Router.Switch>
      {this.loggedIn ? (
        <Route path="/account">
          <app-account></app-account>
        </Route>
      ) : (
        <Route path="/account" to="/login" />
      )}
    </Router.Switch>
  );
}
```

### Reacting to route changes

```tsx
componentWillLoad() {
  Router.on("change", (newUrl: URL, oldUrl: URL) => {
    // e.g. send an analytics page view
  });
}

render() {
  return (
    <nav>
      <a {...href("/main")} class={{ active: Router.path === "/main" }}>Main</a>
      <a {...href("/account")} class={{ active: Router.path === "/account" }}>Account</a>
    </nav>
  );
}
```

`Router.on("beforechange", cb)` fires before navigation. Components that read
`Router.path` or `Router.hash` during render re-render when they change.

### Static routers (prerendered sites)

For prerendered `www` builds, `createStaticRouter()` with `staticState()` serializes
a route's data into the page at build time, and fetches it per page during
client-side navigation:

```tsx
import { createStaticRouter, staticState, match, Route } from "@stencil-community/router";

export const Router = createStaticRouter();

const getPost = async ({ page }) => ({ title: await loadTitle(page) });

<Route
  path={match("/blog/:page")}
  mapParams={staticState(getPost)}
  render={(_params, post) => <h1>{post?.title}</h1>}
/>;
```

## API

| Export                           | Description                                                           |
| -------------------------------- | --------------------------------------------------------------------- |
| `createRouter(opts?)`            | Create a router bound to `window.location` / `history`.               |
| `createStaticRouter(opts?)`      | Like `createRouter`, plus static page state for prerendered builds.   |
| `Route`                          | Declares a route (`path`, `render`, `mapParams`, `to`, children).     |
| `href(url, router?)`             | Props for a native `<a>` that navigates client-side.                  |
| `match(path, opts?)`, `matchAny` | Build path matchers with named params.                                |
| `staticState(fn)`                | Wrap a `mapParams` function so its result is serialized at prerender. |

A `Router` exposes `Switch`, `path`, `hash`, `push(href)`, `on(type, cb)`,
`preload({ href, as })` and `dispose()`.

## Development

This repo is a pnpm workspace: `packages/router` is the library and
`packages/demo` is a Stencil app used for browser tests.

```bash
pnpm install
pnpm build       # build the router and the demo
pnpm test        # unit tests (vitest) + browser tests (playwright)
pnpm fmt         # format with oxfmt
```

[npm-badge]: https://img.shields.io/npm/v/@stencil-community/router.svg
[npm-badge-url]: https://www.npmjs.com/package/@stencil-community/router
[ci-badge]: https://github.com/stencil-community/stencil-router/actions/workflows/ci.yml/badge.svg
[ci-badge-url]: https://github.com/stencil-community/stencil-router/actions/workflows/ci.yml
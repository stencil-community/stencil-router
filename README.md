# stencil-router-v2

Stencil Router V2 is an experimental new router for stencil that focus in:

- **Lightweight** (600bytes)
- **Treeshakable** (not used features are not included in the final build)
- **Simple**, provide the bare mininum but it make it extendable with hooks.
- **No DOM**: Router is not render any extra DOM element, to keep styling simple.
- **Fast**: As fast and lightweight as writing your own router with if statements.

## How does it work?

This router backs up the `document.location` in a `@stencil/store`, this way we can respond to changes in document.location is a much simpler, way, not more subscribes, no more event listeners events to connect and disconnect.

Functional Components are the used to collect the list of routes, finally the `Switch` renders only the selected route.


## Install

```bash
npm install stencil-router-v2 --save-dev
```

## Examples

```tsx
import { createRouter, Route } from 'stencil-router-v2';

const Router = createRouter();

@Component({
  tag: 'app-root',
})
export class AppRoot {

  render() {
    return (
      <Host>
        <Router.Switch>

          <Route path="/">
            <h1>Welcome<h1>
            <p>Welcome to the new stencil-router demo</p>
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

### Redirects
```tsx
<Host>
  <Router.Switch>

    <Route path="/" to="/main"/>
    <Route path={/^account/} to="/error"/>

  </Router.Switch>
</Host>
```

### Params

Route can take an optional `render` property that will pass down the params. This method should be used instead of JSX children.

Regex or functional matches have the chance to generate an object of params when the URL matches.


```tsx
import { createRouter, Route, match } from 'stencil-router-v2';

const Router = createRouter();

<Host>
  <Router.Switch>

    <Route
      path={/^acc(ou)nt/}
      render={(params) => (
        <p>{params[1]}</p>
      )}
    />

    <Route
      path={match('/blog/:page')}
      render={({page}) => <blog-post page={page}>}
    />

    <Route
      path={(url) => {
        if (url.includes('hello')) {
          return {user: 'hello'}
        }
        return undefined;
      }}
      render={({user}) => (
        <h1>User: {user}</h1>
      )}
    />

  </Router.Switch>
</Host>
```

### Links

The `href()` function will inject all the handles to an native `anchor`, without extra DOM.

```tsx
import { createRouter, Route, href } from 'stencil-router-v2';

const Router = createRouter();

<Host>
  <Router.Switch>

    <Route path="/main">
      <a {...href('/main')} class="my-link">Go to blog</a>
    </Route>

    <Route path="/blog">
      <a {...href('/main')}>Go to main</a>
    </Route>

  </Router.Switch>
</Host>
```


### Dynamic routes (guards)

```tsx
@Component({
  tag: 'app-root',
})
export class AppRoot {

  @State() logged = false;
  render() {
    return (
      <Host>
        <Router.Switch>

          {this.logged && (
            <Route path="/account">
              <app-account></app-account>
            </Route>
          )}

          {!this.logged && (
            <Route path="/account" to="/error"/>
          )

        </Router.Switch>
      </Host>
    );
  }
}
```

### Subscriptions to route changes

Because the router uses `@stencil/store` its trivial to subscribe to changes in the locations, activeRoute, or even the list of routes.

```tsx
import { createRouter, Route } from 'stencil-router-v2';

const Router = createRouter();

@Component({
  tag: 'app-root',
})
export class AppRoot {
  componentWillLoad() {
    Router.onChange('url', (newValue: InternalRouterState['url'], _oldValue: InternalRouterState['url']) => {
      // Access fields such as pathname, search, etc. from newValue

      // This would be a good place to send a Google Analytics event, for example
    });
  }

  render() {
    const activePath = Router.state.activeRoute?.path;

    return (
      <Host>
        <aside>
          <a class={{'active': activePath === '/main'}}>Main</a>
          <a class={{'active': activePath === '/account'}}>Account</a>
        </aside>

        <Router.Switch>

          <Route path="/main">
            <h1>Welcome<h1>
            <p>Welcome to the new stencil-router demo</p>
          </Route>

          <Route path='/account'>
            <app-account></app-account>
          </Route>

        </Router.Switch>
      </Host>
    );
  }
}
```

The routes state includes:

```tsx
  url: URL;
  activeRoute?: RouteEntry;
  urlParams: { [key: string]: string };
  routes: RouteEntry[];
```


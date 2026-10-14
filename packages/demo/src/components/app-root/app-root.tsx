import { Component, State, Host } from "@stencil/core";
import { Route, RouteParams, href, match, staticState } from "@stencil-community/router";
import { Router } from "../../router";

@Component({
  tag: "app-root",
})
export class AppRoot {
  @State() logged = false;

  render() {
    return (
      <Host>
        <Router.Switch>
          {this.logged ? (
            [<Route path="/" to="/account" />, <Route path="/main" to="/account" />]
          ) : (
            <Route path="/" to="/main" />
          )}

          {this.logged && (
            <Route path="/account">
              <app-account></app-account>
            </Route>
          )}

          <Route path="/main">
            <h1>Main</h1>
            <a {...href("/blog/Hello")}>Go to Hello</a>
            <button onClick={() => (this.logged = true)}>Login</button>
          </Route>

          <Route
            path={match("/blog/:page")}
            mapParams={staticState(blogContent)}
            render={(_params, state) => <h1>Blog {state?.name}</h1>}
          />
        </Router.Switch>
      </Host>
    );
  }
}

const blogContent = ({ page }: RouteParams) => {
  return {
    name: `Page ${page}`,
  };
};

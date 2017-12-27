import { Component, Prop, State } from '@stencil/core';
import matchPath from '../../utils/match-path';
import { RouterHistory, ActiveRouter, Listener, LocationSegments, MatchResults } from '../../global/interfaces';

/**
  * @name Route
  * @module ionic
  * @description
 */
@Component({
  tag: 'stencil-route-link'
})
export class RouteLink {
  @Prop({ context: 'activeRouter' }) activeRouter: ActiveRouter;
  @Prop({ context: 'location' }) location: Location;
  unsubscribe: Listener = () => { return; };

  @Prop() url: string;
  @Prop() urlMatch: string | string[];
  @Prop() exact: boolean = false;
  @Prop() custom: boolean = false;
  @Prop() activeClass: string = 'link-active';

  @State() match: MatchResults | null = null;


  // Identify if the current route is a match.
  computeMatch(pathname?: string) {
    if (!pathname) {
      const location: LocationSegments = this.activeRouter.get('location');
      pathname = location.pathname;
    }
    const match = matchPath(pathname, {
      path: this.urlMatch || this.url,
      exact: this.exact,
      strict: true
    });

    return match;
  }

  componentWillLoad() {
    // subscribe the project's active router and listen
    // for changes. Recompute the match if any updates get
    // pushed
    this.unsubscribe = this.activeRouter.subscribe(() => {
      this.match = this.computeMatch();
    });

    // Likely that this route link could receive a location prop
    this.match = this.computeMatch();
  }

  componentDidUnload() {
    // be sure to unsubscribe to the router so that we don't
    // get any memory leaks
    this.unsubscribe();
  }

  handleClick(e: MouseEvent) {
    e.preventDefault();
    if (!this.activeRouter) {
      console.warn(
        '<stencil-route-link> wasn\'t passed an instance of the router as the "router" prop!'
      );
      return;
    }

    const history: RouterHistory = this.activeRouter.get('history');
    return history.push(this.getUrl(this.url), {});
  }

  // Get the URL for this route link without the root from the router
  getUrl(url: string) {
    const root: string = this.activeRouter.get('root') || '/';

    // Don't allow double slashes
    if(url.charAt(0) == '/' && root.charAt(root.length - 1) == '/') {
      return root.slice(0, root.length-1) + url;
    }
    return root + url;
  }

  render() {
    const classes = {
      [this.activeClass]: this.match !== null
    };

    if (this.custom) {
      return (
        <span class={classes} onClick={this.handleClick.bind(this)}>
          <slot />
        </span>
      );
    } else {
      return (
        <a class={classes} href={this.url} onClick={this.handleClick.bind(this)}>
          <slot />
        </a>
      );
    }
  }
}

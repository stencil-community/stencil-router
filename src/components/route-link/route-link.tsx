import { Component, Prop, State } from '@stencil/core';
import matchPath, { MatchOptions, MatchResults } from '../../utils/match-path';
import { RouterHistory, ActiveRouter, Listener } from '../../global/interfaces';

/**
  * @name Route
  * @module ionic
  * @description
 */
@Component({
  tag: 'stencil-route-link'
})
export class RouteLink {
  @Prop() url: string;
  @Prop() custom: boolean = false;
  @Prop() activeClass: string = 'link-active';

  @State() match: MatchResults | null = null;

  // The instance of the router
  @Prop({ context: 'activeRouter' }) activeRouter: ActiveRouter;
  unsubscribe: Listener = () => { return; };

  // Identify if the current route is a match.
  computeMatch(pathname?: string) {
    pathname = pathname || this.activeRouter.get('location').pathname;
    const options: MatchOptions = {
      path: this.url,
      strict: true
    }

    return matchPath(pathname, options);
  }

  componentWillLoad() {
    // subscribe the project's active router and listen
    // for changes. Recompute the match if any updates get
    // pushed
    this.unsubscribe = this.activeRouter.subscribe(() => {
      this.match = this.computeMatch();
    });
    this.match = this.computeMatch();
  }

  componentWillUnmount() {
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

    (this.activeRouter.get('history') as RouterHistory).push(this.url, {});
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

import { Component, Prop, State } from '@stencil/core';
import { matchPath } from '../../utils/match-path';
import { isModifiedEvent } from '../../utils/dom-utils';
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
  unsubscribe: Listener = () => { return; };

  @Prop() url: string;
  @Prop() urlMatch: string | string[];
  @Prop() activeClass: string = 'link-active';
  @Prop() exact: boolean = false;
  @Prop() strict: boolean = true;

  /**
   *  Custom tag to use instead of an anchor
   */
  @Prop() custom: string = 'a';

  @Prop() anchorClass: string;
  @Prop() anchorRole: string;
  @Prop() anchorTitle: string;
  @Prop() anchorTabIndex: string;


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
      strict: this.strict
    });

    return match;
  }

  componentWillLoad() {
    // subscribe the project's active router and listen
    // for changes. Recompute the match if any updates get
    // pushed
    this.unsubscribe = this.activeRouter.subscribe({
      isMatch: this.computeMatch.bind(this),
      listener: (matchResult: MatchResults) => {
        this.match = matchResult;
      },
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
    if (isModifiedEvent(e)) {
      return;
    }

    e.preventDefault();
    if (!this.activeRouter) {
      console.warn(
        '<stencil-route-link> wasn\'t passed an instance of the router as the "router" prop!'
      );
      return;
    }

    const history: RouterHistory = this.activeRouter.get('history');
    return history.push(this.getUrl(this.url));
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
    let anchorAttributes: { [key: string]: any} = {
      class: {
        [this.activeClass]: this.match !== null,
      },
      onClick: this.handleClick.bind(this)
    }

    if (this.anchorClass) {
      anchorAttributes.class[this.anchorClass] = true;
    }

    if (this.custom === 'a') {
      anchorAttributes = {
        ...anchorAttributes,
        href: this.url,
        title: this.anchorTitle,
        role: this.anchorRole,
        tabindex: this.anchorTabIndex
      }
    }
    return (
      <this.custom {...anchorAttributes}>
        <slot />
      </this.custom>
    );
  }
}

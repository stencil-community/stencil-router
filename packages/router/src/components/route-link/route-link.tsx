import { Component, Prop, State, Watch, Element, ComponentInterface, h } from '@stencil/core';
import { matchPath } from '../../utils/match-path';
import { isModifiedEvent } from '../../utils/dom-utils';
import { RouterHistory, Listener, LocationSegments, MatchResults, Path } from '../../global/interfaces';
import ActiveRouter from '../../global/active-router';

const getUrl = (url: string, root: string) => {
  // Don't allow double slashes
  if (url.charAt(0) == '/' && root.charAt(root.length - 1) == '/') {
    return root.slice(0, root.length-1) + url;
  }
  return root + url;
}

/**
  * @name Route
  * @module ionic
  * @description
 */
@Component({
  tag: 'stencil-route-link'
})
export class RouteLink implements ComponentInterface {
  @Element() el!: HTMLElement;

  unsubscribe: Listener = () => { return; };

  @Prop() url?: string;
  @Prop() urlMatch?: Path;
  @Prop() activeClass: string = 'link-active';
  @Prop() exact: boolean = false;
  @Prop() strict: boolean = true;

 /**
   *  Custom tag to use instead of an anchor
   */
  @Prop() custom: string = 'a';

  @Prop() anchorClass?: string;
  @Prop() anchorRole?: string;
  @Prop() anchorTitle?: string;
  @Prop() anchorTabIndex?: string;
  @Prop() anchorId?: string;

  @Prop() history?: RouterHistory;
  @Prop() location?: LocationSegments;
  @Prop() root?: string;

  @Prop() ariaHaspopup?: string;
  @Prop() ariaPosinset?: string;
  @Prop() ariaSetsize?: number;
  @Prop() ariaLabel?: string;

  @State() match: MatchResults | null = null;


  componentWillLoad() {
    this.computeMatch();
  }

  // Identify if the current route is a match.
  @Watch('location')
  computeMatch() {
    if (this.location) {
      this.match = matchPath(this.location.pathname, {
        path: this.urlMatch || this.url,
        exact: this.exact,
        strict: this.strict
      });
    }
  }

  handleClick(e: MouseEvent) {
    if (isModifiedEvent(e) || !this.history || !this.url || !this.root) {
      return;
    }

    e.preventDefault();
    return this.history.push(getUrl(this.url, this.root));
  }

  // Get the URL for this route link without the root from the router
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

    const href = this.url && this.root ?  getUrl(this.url, this.root) : this.url;

    if (this.custom === 'a') {
      anchorAttributes = {
        ...anchorAttributes,
        href: href,
        title: this.anchorTitle,
        role: this.anchorRole,
        tabindex: this.anchorTabIndex,
        'aria-haspopup': this.ariaHaspopup,
        id: this.anchorId,
        'aria-posinset': this.ariaPosinset,
        'aria-setsize': this.ariaSetsize,
        'aria-label': this.ariaLabel
       }
    }
    return (
      <this.custom {...anchorAttributes}>
        <slot />
      </this.custom>
    );
  }
}

ActiveRouter.injectProps(RouteLink, [
  'history',
  'location',
  'root'
]);

import { Component, Prop, State, Element } from '@stencil/core';

/**
  * @name Route
  * @module ionic
  * @description
 */
@Component({
  tag: 'stencil-route'
})
export class Route {
  @Element() el: HTMLElement;

  @State() routerInstance: any;

  @Prop() url: string;

  @Prop() component: string;

  @Prop() componentProps: any = {};

  @Prop() exact: boolean = false;

  // The instance of the router
  @Prop() router: string;

  @Prop() scrollContainerSelector: string = 'body';

  //@Prop() match: any;
  @State() match: any = {};

  componentWillLoad() {
    setTimeout(() => {
      const routerElement = document.querySelector(this.router);

      if (routerElement) {
        setTimeout(() => {
          this.routerInstance = routerElement;
        });
      }

      routerElement.addEventListener(
        'stencilRouterLoaded',
        (_event: UIEvent) => {}
      );

      routerElement.addEventListener(
        'stencilRouterNavigation',
        (e: UIEvent) => {
          this.match = e.detail;
          const scrollContainerElemenet = document.querySelector(this.scrollContainerSelector);
          scrollContainerElemenet.scrollTop = 0;
        }
      );
    });
  }

  render() {
    if (!this.routerInstance) {
      return null;
    }

    this.match.url = this.routerInstance.match().url;
    const match = this.match;
    const ChildComponent = this.component;

    const cleanedUrl = this.url.split('/').join().replace(/ /g, '');
    const cleanedMatchUrl = match.url.split('/').join().replace(/ /g, '');

    // Check if this route is in the matching URL (for example, a parent route)
    const isInPath = cleanedMatchUrl.indexOf(cleanedUrl) === 0;

    const matches = this.exact ? cleanedMatchUrl === cleanedUrl : isInPath;

    if (matches) {
      return <ChildComponent props={this.componentProps} />;
    } else {
      return <span />;
    }
  }
}

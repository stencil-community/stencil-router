import { Component, Prop, State, h } from '@stencil/core';

/**
  * @name Route
  * @module ionic
  * @description
 */
@Component({
  tag: 'stencil-route'
})
export class Route {
  $el: any;

  @State() routerInstance: any;

  @Prop() path: string;

  @Prop() component: string;

  @Prop() componentProps: any = {};

  @Prop() exact: boolean = false;

  // The instance of the router
  @Prop() router: any;

  //@Prop() match: any;
  @State() match: any = {};

  componentWillLoad() {
    const routerElement = document.querySelector(this.router)

    if(routerElement.$instance) {
      setTimeout(() => {
        this.routerInstance = routerElement.$instance;
      })
    }

    routerElement.addEventListener('stencilRouterLoaded', (e) => {
      this.routerInstance = routerElement.$instance;
    })

    routerElement.addEventListener('stencilRouterNavigation', (e) => {
      //console.log(`<stencil-route> for ${this.path} got nav event`, e.detail);
      this.match = e.detail;
    })
  }

  render() {
    if(!this.routerInstance) {
      return null;
    }

    //console.log(`<stencil-route> for ${this.path} rendering`);
    this.match.url = this.routerInstance.routeMatch.url;
    const match = this.match
    const ChildComponent = this.component

    // Check if this route is in the matching URL (for example, a parent route)
    const isInPath = this.match.url.indexOf(this.path) == 0

    const matches = this.exact ? match.url == this.path: isInPath;

    //console.log(`\tDoes ${match.url} match our path ${this.path}?`, matches)

    if(matches) {
      console.log(`  <ion-route> Rendering route ${this.path}`, this.router, match);
      return (<ChildComponent props={this.componentProps} />);
    } else {
      return <span></span>;
    }
  }
}

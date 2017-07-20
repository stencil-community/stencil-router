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

  @Prop() url: string;

  @Prop() component: string;

  @Prop() componentProps: any = {};

  // The instance of the router
  @Prop() router: any;

  //@Prop() match: any;
  @State() match: any = {};

  componentWillLoad() {
    const routerElement = document.querySelector(this.router)

    if(routerElement.$instance) {
      this.routerInstance = routerElement.$instance;
    }

    routerElement.addEventListener('stencilRouterLoaded', (e) => {
      this.routerInstance = routerElement.$instance;
    })

    routerElement.addEventListener('stencilRouterNavigation', (e) => {
      console.log(`<stencil-route> for ${this.url} got nav event`, e.detail);
      this.match = e.detail;
    })
  }

  render() {
    console.log(`<stencil-route> for ${this.url} rendering`);
    if(!this.routerInstance) {
      console.log('No router instance here', this);
      return null;
    }

    this.match.url = this.routerInstance.routeMatch.url;
    const match = this.match
    const ChildComponent = this.component

    console.log('Does match match?', match.url, this.url)

    //return <p></p>;

    if(match.url == this.url) {
      console.log(`  <ion-route> Rendering route ${this.url}`, this.router, match);
      return (<ChildComponent props={this.componentProps} />);
    } else {
      return <span></span>;
    }
  }
}

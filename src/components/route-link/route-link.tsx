import { Component, Prop, Element, Listen } from '@stencil/core';

/**
  * @name Route
  * @module ionic
  * @description
 */
@Component({
  tag: 'stencil-route-link'
})
export class RouteLink {
  @Element() el: HTMLElement;
  @Prop() url: string;

  @Prop() custom: boolean = false;

  @Prop() activeClass: string = 'link-active';

  // The instance of the router
  @Prop() router: any;

  @Listen('body:stencilRouterNavigation')
  handleRouteChange(ev) {
    if (this.url === ev.detail.url) {
      this.el.classList.add(this.activeClass);
    } else {
      this.el.classList.remove(this.activeClass);
    }
  }

  @Listen('body:stencilRouterLoaded')
  handleRouterLoaded(ev) {
    if (this.url === ev.detail.url) {
      this.el.classList.add(this.activeClass);
    } else {
      this.el.classList.remove(this.activeClass);
    }
  }

  handleClick(e) {
    e.preventDefault();
    const router = document.querySelector(this.router);
    if (!router) {
      console.warn(
        '<stencil-route-link> wasn\'t passed an instance of the router as the "router" prop!'
      );
      return;
    }

    router.navigateTo(this.url);
  }

  render() {
    if (this.custom) {
      return (
        <span onClick={this.handleClick.bind(this)}>
          <slot />
        </span>
      );
    } else {
      return (
        <a href={this.url} onClick={this.handleClick.bind(this)}>
          <slot />
        </a>
      );
    }
  }
}

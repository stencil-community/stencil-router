import { Component, Prop, Method, State, Element } from '@stencil/core';

/**
  * @name Router
  * @module ionic
  * @description
 */
@Component({
  tag: 'stencil-router'
})
export class Router {
  @Element() el: HTMLElement;

  base: string;

  @Prop() root: string = '/';

  @State() routeMatch: any = {};

  @Method()
  match() {
    return this.routeMatch
  }

  @Method()
  navigateTo(url: string, _data: any = {}) {
    window.history.pushState(null, null, url || '/');
    this.routeMatch = {
      url: url
    }

    this.el.dispatchEvent(new (window as any).CustomEvent('stencilRouterNavigation', { detail: this.routeMatch }))
  }

  componentWillLoad() {
    window.addEventListener('popstate', this.handlePopState.bind(this));
    window.onhashchange = this.handleHashChange.bind(this);

    const initialPath = window.location.pathname;
    //const withoutBase = '';
    const withoutBase = initialPath.replace(this.root, '')

    this.routeMatch = {
      url: "/" + withoutBase
    }
  }

  componentDidLoad() {
    this.el.dispatchEvent(new (window as any).CustomEvent('stencilRouterLoaded'))
  }

  handlePopState() {
    if (window.location.pathname !== oldPathName) {
      this.routeMatch = {
        url: window.location.pathname
      }

      this.el.dispatchEvent(new (window as any).CustomEvent('stencilRouterNavigation', { detail: this.routeMatch }))
    } else {
      this.navigateTo(window.location.pathname);
    }

    var oldPathName = window.location.pathname;
  }

  handleHashChange(_event: UIEvent) {
  }

  render() {
    return (
      <slot></slot>
    );
  }
}
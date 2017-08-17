import {
  Component,
  Prop,
  Method,
  State,
  Element,
  Event,
  EventEmitter
} from '@stencil/core';

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
  @Prop({ context: 'activeRouter' }) activeRouter: any;

  @State() history: any = {};

  @Event() private stencilRouterNavigation: EventEmitter;
  @Event() private stencilRouterLoaded: EventEmitter;

  componentWillLoad() {
    this.activeRouter.set({
      location,
      history: this.history
    });
  }

  computeMatch(pathname) {
    return {
      path: '/',
      url: '/',
      params: {},
      isExact: pathname === '/'
    };
  }

  componentDidLoad() {
    this.stencilRouterLoaded.emit({ url: window.location.pathname });
  }

  handlePopState() {
    if (window.location.pathname !== oldPathName) {
      this.routeMatch = {
        url: window.location.pathname
      };
      this.stencilRouterNavigation.emit(this.routeMatch);
    } else {
      this.navigateTo(window.location.pathname);
    }

    var oldPathName = window.location.pathname;
  }

  handleHashChange(_event: UIEvent) {}

  render() {
    return <slot />;
  }
}

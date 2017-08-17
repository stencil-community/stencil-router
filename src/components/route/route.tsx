import { Component, Prop, State, Element } from '@stencil/core';
import matchPath, { MatchOptions } from '../../utils/match-path';

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

  unsubscribe: Function = () =>{}

  @Prop({ context: 'activeRouter' }) activeRouter: any;
  @State() routerInstance: any;
  @Prop() url: string;
  @Prop() component: string;
  @Prop() componentProps: any = {};
  @Prop() exact: boolean = false;
  @Prop() routeRender: Function;

  @State() match: any = {};

  computeMatch(pathname?: string) {
    pathname = pathname || this.activeRouter.get('location').pathname;
    const options: MatchOptions = {
      path: this.url,
      exact: this.exact,
      strict: true
    }

    return matchPath(pathname, options);
  }

  componentWillLoad() {
    this.unsubscribe = this.activeRouter.subscribe(() => {
      this.match = this.computeMatch();
    });
    this.match = this.computeMatch();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    if (!this.activeRouter) {
      return null;
    }

    // Check if this route is in the matching URL (for example, a parent route)
    if (!this.match) {
      return <span />
    }

    const childProps = {
      ...this.componentProps,
      history: this.activeRouter.get('history'),
      match: this.match
    }

    if (this.routeRender) {
      return this.routeRender(childProps);
    }
    if (this.component) {
      const ChildComponent = this.component;
      return <ChildComponent {...childProps} />;
    }
  }
}

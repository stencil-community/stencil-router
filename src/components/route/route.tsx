import { Component, Prop, State, Element } from '@stencil/core';
import matchPath, { MatchOptions } from '../../utils/match-path';
import { ActiveRouter } from '../../global/interfaces';

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

  @Prop({ context: 'activeRouter' }) activeRouter: ActiveRouter;
  @Prop() url: string;
  @Prop() component: string;
  @Prop() componentProps: any = {};
  @Prop() exact: boolean = false;
  @Prop() routeRender: Function = null;

  @State() match: any = {};

  // Identify if the current route is a match.
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

  render() {
    // If there is no activeRouter then do not render
    // Check if this route is in the matching URL (for example, a parent route)
    if (!this.activeRouter || !this.match) {
      return null;
    }

    // component props defined in route
    // the history api
    // current match data including params
    const childProps = {
      ...this.componentProps,
      history: this.activeRouter.get('history'),
      match: this.match
    }

    // If there is a routerRender defined then use
    // that and pass the component and component props with it.
    if (this.routeRender) {
      return this.routeRender({
        ...childProps,
        component: this.component
      });
    }

    if (this.component) {
      const ChildComponent = this.component;
      return <ChildComponent {...childProps} />;
    }
  }
}

import { Component, Prop, Element, Watch, ComponentInterface } from '@stencil/core';
import { matchPath, matchesAreEqual } from '../../utils/match-path';
import { RouterHistory, LocationSegments, MatchResults, RouteViewOptions, HistoryType, RouteRenderProps } from '../../global/interfaces';
import ActiveRouter from '../../global/active-router';

/**
  * @name Route
  * @module ionic
  * @description
 */
@Component({
  tag: 'stencil-route',
  styleUrl: 'route.css'
})
export class Route implements ComponentInterface {
  @Prop() group: string | null = null;
  @Prop() componentUpdated: (options: RouteViewOptions) => void = null;
  @Prop({ mutable: true }) match: MatchResults | null = null;

  @Prop() url: string | string[];
  @Prop() component: string;
  @Prop() componentProps: { [key: string]: any } = {};
  @Prop() exact: boolean = false;
  @Prop() routeRender: (props: RouteRenderProps) => any = null;
  @Prop() scrollTopOffset: number = null;
  @Prop() routeViewsUpdated: (options: RouteViewOptions) => void;

  @Prop() location: LocationSegments;
  @Prop() history: RouterHistory;
  @Prop() historyType: HistoryType;


  @Element() el: HTMLStencilRouteElement;

  componentDidRerender: Function | undefined;
  scrollOnNextRender: boolean = false;
  previousMatch: MatchResults = null;
  isGrouped: boolean = false;

  componentWillLoad() {
    // We need to check if it is part of a group. This will load before parent
    // can pass down props
    this.isGrouped = this.group != null || this.el.parentElement.tagName.toLowerCase() === 'stencil-route-switch';
  }

  // Identify if the current route is a match.
  @Watch('location')
  computeMatch() {
    if (this.isGrouped) {
      return;
    }

    this.previousMatch = this.match;
    return this.match = matchPath(this.location.pathname, {
      path: this.url,
      exact: this.exact,
      strict: true
    });
  }


  async componentDidUpdate() {
    // After all children have completed then tell switch
    // the provided callback will get executed after this route is in view
    if (typeof this.componentUpdated === 'function') {
      this.componentUpdated({
        scrollTopOffset: this.scrollTopOffset
      });

    // If this is an independent route and it matches then routes have updated.
    // If the only change to location is a hash change then do not scroll.
    } else if (this.match && !matchesAreEqual(this.match, this.previousMatch)) {
      this.routeViewsUpdated({
        scrollTopOffset: this.scrollTopOffset
      });
    }
  }

  render() {
    // If there is no activeRouter then do not render
    // Check if this route is in the matching URL (for example, a parent route)
    if (!this.match) {
      return null;
    }

    // component props defined in route
    // the history api
    // current match data including params
    const childProps: RouteRenderProps = {
      ...this.componentProps,
      history: this.history,
      match: this.match
    };

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

      return (
        <ChildComponent {...childProps} />
      );
    }
  }
}

ActiveRouter.injectProps(Route, [
  'location',
  'history',
  'historyType',
  'routeViewsUpdated'
]);

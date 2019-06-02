import { Component, Prop, Element, Watch, ComponentInterface, h } from '@stencil/core';
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
  @Prop({ reflectToAttr: true }) group: string | null = null;
  @Prop() componentUpdated?: (options: RouteViewOptions) => void;
  @Prop({ mutable: true }) match: MatchResults | null = null;

  @Prop() url?: string | string[];
  @Prop() component?: string;
  @Prop() componentProps?: { [key: string]: any } = {};
  @Prop() exact: boolean = false;
  @Prop() routeRender?: (props: RouteRenderProps) => any;
  @Prop() scrollTopOffset?: number;
  @Prop() routeViewsUpdated?: (options: RouteViewOptions) => void;

  @Prop() location?: LocationSegments;
  @Prop() history?: RouterHistory;
  @Prop() historyType?: HistoryType;


  @Element() el!: HTMLStencilRouteElement;

  componentDidRerender: Function | undefined;
  scrollOnNextRender: boolean = false;
  previousMatch: MatchResults | null = null;

  // Identify if the current route is a match.
  @Watch('location')
  computeMatch(newLocation: LocationSegments) {
    const isGrouped = this.group != null || (this.el.parentElement != null && this.el.parentElement.tagName.toLowerCase() === 'stencil-route-switch');

    if (!newLocation || isGrouped) {
      return;
    }

    this.previousMatch = this.match;
    return this.match = matchPath(newLocation.pathname, {
      path: this.url,
      exact: this.exact,
      strict: true
    });
  }


  async loadCompleted() {
    let routeViewOptions: RouteViewOptions = {};

    if (this.history && this.history.location.hash) {
      routeViewOptions = {
        scrollToId: this.history.location.hash.substr(1)
      }
    } else if (this.scrollTopOffset) {
      routeViewOptions = {
        scrollTopOffset: this.scrollTopOffset
      }
    }
    // After all children have completed then tell switch
    // the provided callback will get executed after this route is in view
    if (typeof this.componentUpdated === 'function') {
      this.componentUpdated(routeViewOptions);

    // If this is an independent route and it matches then routes have updated.
    // If the only change to location is a hash change then do not scroll.
    } else if (this.match && !matchesAreEqual(this.match, this.previousMatch) && this.routeViewsUpdated) {
      this.routeViewsUpdated(routeViewOptions);
    }
  }

  async componentDidUpdate() {
    await this.loadCompleted();
  }
  async componentDidLoad() {
    await this.loadCompleted();
  }

  render() {
    // If there is no activeRouter then do not render
    // Check if this route is in the matching URL (for example, a parent route)
    if (!this.match || !this.history) {
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

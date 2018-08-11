import { Component, Prop, State, Element, Watch } from '@stencil/core';
import { matchPath, matchesAreEqual } from '../../utils/match-path';
import { RouterHistory, Listener, LocationSegments, MatchResults, RouteViewOptions, HistoryType } from '../../global/interfaces';
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
export class Route {
  @Prop() group: string | null = null;
  @Prop() groupMatch: MatchResults | null = null;
  @Prop() componentUpdated: (options: RouteViewOptions) => void = null;
  @State() match: MatchResults | null = null;

  unsubscribe: Listener = () => { return; };

  @Prop() url: string | string[];
  @Prop() component: string;
  @Prop() componentProps: { [key: string]: any } = {};
  @Prop() exact: boolean = false;
  @Prop() routeRender: Function = null;
  @Prop() scrollTopOffset: number = null;
  @Prop() routeViewsUpdated: (options: RouteViewOptions) => void;

  @Prop() location: LocationSegments;
  @Prop() history: RouterHistory;
  @Prop() historyType: HistoryType;


  @Element() el: HTMLStencilRouteElement;

  componentDidRerender: Function | undefined;
  scrollOnNextRender: boolean = false;
  previousMatch: MatchResults = null;

  // Identify if the current route is a match.
  @Watch('location')
  computeMatch() {
    this.previousMatch = this.match;

    if (!this.group) {
      return this.match = matchPath(this.location.pathname, {
        path: this.url,
        exact: this.exact,
        strict: true
      });
    }

    // If this already matched then lets check if it still matches the
    // updated location.
    if (this.groupMatch) {
      return this.match = matchPath(this.location.pathname, {
        path: this.url,
        exact: this.exact,
        strict: true
      });
    }
  }


  componentDidUpdate() {
    // Wait for all children to complete rendering before calling componentUpdated
    Promise.all(
      Array.from(this.el.children).map((element:HTMLStencilElement) => {
        if (element.componentOnReady) {
          return element.componentOnReady();
        }
        return Promise.resolve(element);
      })
    )
    .then(() => {
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
    });
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
    const childProps = {
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

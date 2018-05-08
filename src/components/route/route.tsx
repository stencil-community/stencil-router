import { Component, Prop, State, Element } from '@stencil/core';
import { matchPath } from '../../utils/match-path';
import { RouterHistory, ActiveRouter, Listener, LocationSegments, MatchResults } from '../../global/interfaces';
import { QueueApi } from '@stencil/core/dist/declarations';

/**
  * @name Route
  * @module ionic
  * @description
 */
@Component({
  tag: 'stencil-route'
})
export class Route {
  @Prop({ context: 'activeRouter' }) activeRouter: ActiveRouter;
  @Prop({ context: 'location' }) location: Location;
  @Prop({ context: 'queue'}) queue: QueueApi;
  @Prop({ context: 'isServer' }) private isServer: boolean;

  unsubscribe: Listener = () => { return; };

  @Prop() url: string | string[];
  @Prop() component: string;
  @Prop() componentProps: { [key: string]: any } = {};
  @Prop() exact: boolean = false;
  @Prop() group: string = null;
  @Prop() groupIndex: number = null;
  @Prop() routeRender: Function = null;
  @Prop() scrollTopOffset: number = null;

  @State() match: MatchResults | null = null;
  @State() activeInGroup: boolean = false;

  @Element() el: HTMLStencilElement;

  componentDidRerender: Function | undefined;
  scrollOnNextRender: boolean = false;


  // Identify if the current route is a match.
  computeMatch(pathname?: string) {
    if (!pathname) {
      const location: LocationSegments = this.activeRouter.get('location');
      pathname = location.pathname;
    }

    return matchPath(pathname, {
      path: this.url,
      exact: this.exact,
      strict: true
    });
  }

  componentWillLoad() {
    const thisRoute = this;
    // subscribe the project's active router and listen
    // for changes. Recompute the match if any updates get
    // pushed
    const listener = (matchResults: MatchResults) => {
      this.match = matchResults;
      return new Promise((resolve) => {
        thisRoute.componentDidRerender = resolve;
      });
    }
    this.unsubscribe = this.activeRouter.subscribe({
      isMatch: this.computeMatch.bind(this),
      listener,
      groupId: this.group,
      groupIndex: this.groupIndex
    });
  }

  componentDidUnload() {
    // be sure to unsubscribe to the router so that we don't
    // get any memory leaks
    this.unsubscribe();
  }

  componentDidUpdate() {
    if (this.componentDidRerender) {
      // After route component has rendered then check if its child has.
      const childElement = this.el.firstElementChild as HTMLStencilElement;
      if (childElement && childElement.componentOnReady) {

        childElement.componentOnReady().then(() => {
          if (this.componentDidRerender) {
            this.componentDidRerender();
          }
          this.componentDidRerender = undefined;
          this.activeInGroup = !!this.match;
          this.scrollOnNextRender = this.activeInGroup;
        });
      } else {
        // If there is no child then resolve the Promise immediately
        this.componentDidRerender();
        this.componentDidRerender = undefined;
        this.activeInGroup = !!this.match;
        this.scrollOnNextRender = this.activeInGroup;
      }

    } else if (this.scrollOnNextRender) {
      // If this is the new active route in a group and it is now active then scroll
      this.scrollTo();
      this.scrollOnNextRender = false;
    }
  }

  scrollTo() {
    const history: RouterHistory = this.activeRouter.get('history');
    if (this.scrollTopOffset == null || !history || this.isServer) {
      return;
    }
    if (history.action === 'POP' && history.location.scrollPosition != null) {
      return this.queue.write(function() {
        window.scrollTo(history.location.scrollPosition[0], history.location.scrollPosition[1]);
      });
    }
    // read a frame to let things measure correctly
    return this.queue.read(() => {
      // okay, the frame has passed. Go ahead and render now
      return this.queue.write(() => {
        window.scrollTo(0, this.scrollTopOffset);
      });
    });
  }

  hostData() {
    if (!this.activeRouter || !this.match || (this.group && !this.activeInGroup)) {
      return {
        style: {
          display: 'none'
        }
      };
    }
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
      history: this.activeRouter.get('history') as RouterHistory,
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

import { Component, Prop, State, Element, Watch } from '@stencil/core';
import { matchPath } from '../../utils/match-path';
import { RouterHistory, Listener, LocationSegments, MatchResults } from '../../global/interfaces';
import { QueueApi } from '@stencil/core/dist/declarations';
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
  @Prop({ context: 'queue'}) queue: QueueApi;
  @Prop({ context: 'isServer' }) private isServer: boolean;

  @Prop() group: string | null = null;
  @Prop() groupMatch: MatchResults | null = null;
  @Prop() componentUpdated: (callback: () => void) => void;
  @State() match: MatchResults | null = null;

  unsubscribe: Listener = () => { return; };

  @Prop() url: string | string[];
  @Prop() component: string;
  @Prop() componentProps: { [key: string]: any } = {};
  @Prop() exact: boolean = false;
  @Prop() routeRender: Function = null;
  @Prop() scrollTopOffset: number = null;

  @Prop() location: LocationSegments;
  @Prop() history: RouterHistory;


  @Element() el: HTMLStencilRouteElement;

  componentDidRerender: Function | undefined;
  scrollOnNextRender: boolean = false;

  async componentWillLoad() {
    if (this.groupMatch) {
      this.groupMatchChanged(this.groupMatch);
    }
  }

  @Watch('groupMatch')
  groupMatchChanged(groupMatchValue: MatchResults) {
    this.match = groupMatchValue;
  }

  // Identify if the current route is a match.
  @Watch('location')
  computeMatch() {
    // If you are in a group then your switch handles this.
    if (this.group) {
      return;
    }
    this.match = matchPath(this.location.pathname, {
      path: this.url,
      exact: this.exact,
      strict: true
    });
  }

  async componentDidUpdate() {
    if (this.componentUpdated) {

      // Wait for all children to complete rendering before calling componentUpdated
      await Promise.all(
        Array.from(this.el.children).map((element:HTMLStencilElement) => {
          if (element.componentOnReady) {
            return element.componentOnReady();
          }
          return Promise.resolve(element);
        })
      )

      // After all children have completed then tell switch
      // the provided callback will get executed after this route is in view
      this.componentUpdated(this.scrollTo.bind(this));
    }
  }

  scrollTo() {
    if (this.scrollTopOffset == null || !this.history || this.isServer) {
      return;
    }

    if (this.history.action === 'POP' && this.history.location.scrollPosition != null) {
      return this.queue.write(() => {
        window.scrollTo(this.history.location.scrollPosition[0], this.history.location.scrollPosition[1]);
      });
    }
    // okay, the frame has passed. Go ahead and render now
    return this.queue.write(() => {
      window.scrollTo(0, this.scrollTopOffset);
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
  'history'
]);

import { Component, Prop, State } from '@stencil/core';
import createHistory from '../../utils/createBrowserHistory';
import createHashHistory from '../../utils/createHashHistory';
import { LocationSegments, HistoryType, RouterHistory, RouteViewOptions } from '../../global/interfaces';
import ActiveRouter, { ActiveRouterState } from '../../global/active-router';
import { QueueApi, ComponentInstance } from '@stencil/core/dist/declarations';


const HISTORIES: { [key in HistoryType]: Function } = {
  'browser': createHistory,
  'hash': createHashHistory
};

/**
  * @name Router
  * @module ionic
  * @description
 */
@Component({
  tag: 'stencil-router'
})
export class Router implements ComponentInstance {
  @Prop() root: string = '/';
  @Prop({ context: 'isServer' }) private isServer: boolean;
  @Prop({ context: 'queue'}) queue: QueueApi;

  @Prop() historyType: HistoryType = 'browser';

  // A suffix to append to the page title whenever
  // it's updated through RouteTitle
  @Prop() titleSuffix: string = '';
  @Prop() scrollTopOffset: number = null;

  @State() location: LocationSegments;
  @State() history: RouterHistory;

  componentWillLoad() {
    this.history = HISTORIES[this.historyType]();

    this.history.listen(async (location: LocationSegments) => {
      location = this.getLocation(location);
      this.location = location;
    });
    this.location = this.getLocation(this.history.location);
  }

  routeViewsUpdated = (options: RouteViewOptions = {}) => {
    this.scrollTo(options.scrollTopOffset || this.scrollTopOffset);
  }

  scrollTo(scrollToLocation: number) {
    if (scrollToLocation == null || this.isServer ||  !this.history) {
      return;
    }

    if (this.history.action === 'POP' && this.history.location.scrollPosition != null) {
      return this.queue.write(() => {
        window.scrollTo(this.history.location.scrollPosition[0], this.history.location.scrollPosition[1]);
      });
    }
    // okay, the frame has passed. Go ahead and render now
    return this.queue.write(() => {
      window.scrollTo(0, scrollToLocation);
    });
  }


  getLocation(location: LocationSegments): LocationSegments {
    // Remove the root URL if found at beginning of string
    const pathname = location.pathname.indexOf(this.root) == 0 ?
                     '/' + location.pathname.slice(this.root.length) :
                     location.pathname;

    return {
      ...location,
      pathname
    };
  }

  render() {
    const state: ActiveRouterState = {
      historyType: this.historyType,
      location: this.location,
      titleSuffix: this.titleSuffix,
      root: this.root,
      history: this.history,
      routeViewsUpdated: this.routeViewsUpdated
    };

    return (
      <ActiveRouter.Provider state={state}>
        <slot />
      </ActiveRouter.Provider>
    );
  }
}

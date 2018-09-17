import { Component, Prop, State, ComponentInterface } from '@stencil/core';
import createHistory from '../../utils/createBrowserHistory';
import createHashHistory from '../../utils/createHashHistory';
import { LocationSegments, HistoryType, RouterHistory, RouteViewOptions } from '../../global/interfaces';
import ActiveRouter, { ActiveRouterState } from '../../global/active-router';
import { QueueApi } from '@stencil/core/dist/declarations';

function getLocation(location: LocationSegments, root: string): LocationSegments {
  // Remove the root URL if found at beginning of string
  const pathname = location.pathname.indexOf(root) == 0 ?
                    '/' + location.pathname.slice(root.length) :
                    location.pathname;

  return {
    ...location,
    pathname
  };
}

const HISTORIES: { [key in HistoryType]: () => RouterHistory } = {
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
export class Router implements ComponentInterface {
  @Prop() root: string = '/';
  @Prop({ context: 'isServer' }) private isServer!: boolean;
  @Prop({ context: 'queue'}) queue!: QueueApi;

  @Prop() historyType: HistoryType = 'browser';

  // A suffix to append to the page title whenever
  // it's updated through RouteTitle
  @Prop() titleSuffix: string = '';
  @Prop() scrollTopOffset?: number;

  @State() location?: LocationSegments;
  @State() history?: RouterHistory;

  componentWillLoad() {
    this.history = HISTORIES[this.historyType]();

    this.history.listen(async (location: LocationSegments) => {
      location = getLocation(location, this.root);
      this.location = location;
    });
    this.location = getLocation(this.history.location, this.root);
  }

  routeViewsUpdated = (options: RouteViewOptions = {}) => {
    this.scrollTo(options.scrollTopOffset || this.scrollTopOffset);
  }

  scrollTo(scrollToLocation?: number) {
    if (scrollToLocation == null || this.isServer || !this.history) {
      return;
    }

    if (this.history.action === 'POP' && Array.isArray(this.history.location.scrollPosition)) {
      return this.queue.write(() => {
        if (this.history && this.history.location && Array.isArray(this.history.location.scrollPosition)) {
          window.scrollTo(this.history.location.scrollPosition[0], this.history.location.scrollPosition[1]);
        }
      });
    }
    // okay, the frame has passed. Go ahead and render now
    return this.queue.write(() => {
      window.scrollTo(0, scrollToLocation);
    });
  }


  render() {
    if (!this.location || !this.history) {
      return;
    }
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

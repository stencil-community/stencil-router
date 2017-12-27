import { Component, Prop, PropDidChange, State } from '@stencil/core';
import createHistory from '../../utils/createBrowserHistory';
import { ActiveRouter, LocationSegments, MatchResults } from '../../global/interfaces';

/**
  * @name Router
  * @module ionic
  * @description
 */
@Component({
  tag: 'stencil-router'
})
export class Router {
  @Prop() root: string = '/';

  // A suffix to append to the page title whenever
  // it's updated through RouteTitle
  @Prop() titleSuffix: string = '';
  @PropDidChange('titleSuffix')
  titleSuffixChanged(newValue: string) {
    this.activeRouter.set({
      titleSuffix: newValue
    });
  }

  @Prop({ context: 'activeRouter' }) activeRouter: ActiveRouter;
  unsubscribe: Function = () => {};

  @State() match: MatchResults | null = null;

  computeMatch(pathname?: string) {
    return {
      path: this.root,
      url: this.root,
      isExact: pathname === this.root,
      params: {}
    } as MatchResults;
  }

  componentWillLoad() {
    const history = createHistory();

    history.listen((location: LocationSegments) => {
      this.activeRouter.set({ location: this.getLocation(location) });
    });

    this.activeRouter.set({
      location: this.getLocation(history.location),
      titleSuffix: this.titleSuffix,
      root: this.root,
      history
    });

    // subscribe the project's active router and listen
    // for changes. Recompute the match if any updates get
    // pushed
    this.unsubscribe = this.activeRouter.subscribe(() => {
      this.match = this.computeMatch();
    });
    this.match = this.computeMatch();
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

  componentDidUnload() {
    // be sure to unsubscribe to the router so that we don't
    // get any memory leaks
    this.unsubscribe();
  }

  render() {
    return <slot />;
  }
}

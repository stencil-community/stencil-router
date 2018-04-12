import { Component, Prop, State, Watch } from '@stencil/core';
import createHistory from '../../utils/createBrowserHistory';
import createHashHistory from '../../utils/createHashHistory';
import { ActiveRouter, LocationSegments, MatchResults, HistoryType} from '../../global/interfaces';


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
export class Router {
  @Prop() root: string = '/';

  @Prop() historyType: HistoryType = 'browser';

  // A suffix to append to the page title whenever
  // it's updated through RouteTitle
  @Prop() titleSuffix: string = '';

  @Watch('titleSuffix')
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
    const history = HISTORIES[this.historyType]();

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
    this.unsubscribe = this.activeRouter.subscribe({
      isMatch: this.computeMatch.bind(this),
      listener: (matchResult: MatchResults) => {
        this.match = matchResult;
      },
    });
    this.match = this.computeMatch();
  }

  componentDidLoad() {
    this.activeRouter.dispatch();
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

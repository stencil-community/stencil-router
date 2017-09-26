import { Component, Prop, State, VNodeData } from '@stencil/core';
import matchPath from '../../utils/match-path';
import { RouterHistory, ActiveRouter, Listener, LocationSegments, MatchResults } from '../../global/interfaces';

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
  unsubscribe: Listener = () => { return; };

  @Prop() url: string | string[];
  @Prop() component: string;
  @Prop() componentProps: any = {};
  @Prop() exact: boolean = false;
  @Prop() group: string = null;
  @Prop() routeRender: Function = null;

  @State() match: MatchResults | null = null;


  // Identify if the current route is a match.
  computeMatch(pathname?: string) {
    if (!pathname) {
      const location: LocationSegments = this.activeRouter.get('location');
      pathname = location.pathname;
    }

    const newMatch = matchPath(pathname, {
      path: this.url,
      exact: this.exact,
      strict: true
    });

    // If we have a match and we've already matched for the group, don't set the match
    if (newMatch) {
      if (this.group && this.activeRouter.didGroupAlreadyMatch(this.group)) {
        return null;
      }
      this.group && this.activeRouter.setGroupMatched(this.group);
    }

    return newMatch;
  }

  componentWillLoad() {
    // subscribe the project's active router and listen
    // for changes. Recompute the match if any updates get
    // pushed

    if (this.group) {
      this.activeRouter.addToGroup(this, this.group);
    }

    this.unsubscribe = this.activeRouter.subscribe(() => {
      this.match = this.computeMatch();
    });
    this.match = this.computeMatch();
  }

  componentDidUnload() {
    // be sure to unsubscribe to the router so that we don't
    // get any memory leaks

    this.activeRouter.removeFromGroups(this);

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
      // This is a temporary fix until we get the JSX transform working correctly with child components
      var vdomrender = h;
      return vdomrender(ChildComponent, {p: childProps} as VNodeData);
    }
  }
}

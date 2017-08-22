import { Component, Prop } from '@stencil/core';
import createHistory from '../../utils/history';
import { ActiveRouter } from '../../global/interfaces';
import { MatchResults } from '../../utils/match-path';

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
  @Prop({ context: 'activeRouter' }) activeRouter: ActiveRouter;

  componentWillLoad() {
    const history = createHistory();
    this.activeRouter.set({
      location,
      history
    });
  }

  computeMatch(pathname) {
    return {
      path: this.root,
      url: this.root,
      isExact: pathname === this.root,
      params: {}
    } as MatchResults;
  }

  render() {
    return <slot />;
  }
}
